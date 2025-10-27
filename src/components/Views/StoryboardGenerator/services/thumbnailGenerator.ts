import { OpenRouterService } from '@canva-ct/genai/openrouter';

interface StyleContext {
  camera_type?: string;
  lighting_style?: string;
  colour_palette?: string;
  render_style?: string;
  aspect_ratio?: string;
  style_filters: string[];
}

interface Character {
  id: string;
  name: string;
  description: string;
  appearance?: string;
  wardrobe?: string;
  age_range?: string;
  tags?: string[];
}

interface ObjectItem {
  id: string;
  name: string;
  description: string;
  visual_traits?: string;
  tags?: string[];
}

interface Environment {
  id: string;
  name: string;
  description: string;
  visual_details?: string;
  lighting?: string;
  tags?: string[];
}

interface Shot {
  shot_id: string;
  shot_number: number;
  description: string;
  shot_type: string;
  thumbnail_prompt: string;
  visual_prompt: string;
  environment_id?: string;
  characters?: string[];
  objects?: string[];
  duration_s?: number;
}

interface Scene {
  scene_id: string;
  title: string;
  description: string;
  visual_prompt: string;
  shots: Shot[];
}

interface StoryboardData {
  input: { user_prompt: string; style_filter: string[]; duration_seconds: number };
  styleSettings?: StyleContext;
  characterRegistry?: Character[];
  objectRegistry?: ObjectItem[];
  environmentRegistry?: Environment[];
  scenes: Scene[];
}

interface ThumbnailRequest {
  shotId: string;
  shotNumber: number;
  thumbnailPrompt: string;
  visualPrompt: string;
  shotType: string;
  sceneVisualPrompt: string;
  environmentId?: string;
  characterIds?: string[];
  objectIds?: string[];
  previousShotsInContext?: Shot[];
}

interface ThumbnailResult {
  shotId: string;
  imageUrl: string | null;
  error?: string;
}

class ThumbnailGeneratorService {
  private openRouterService: OpenRouterService;
  private generationQueue: Map<string, Promise<ThumbnailResult>>;

  constructor() {
    this.openRouterService = new OpenRouterService();
    this.generationQueue = new Map();
  }

  /**
   * Build hierarchical context from storyboard data
   */
  private buildHierarchicalContext(
    request: ThumbnailRequest,
    storyboardData: StoryboardData
  ): string {
    const contextParts: string[] = [];

    // 1. Video summary (brief narrative arc)
    contextParts.push(`Video Context: ${storyboardData.input.user_prompt}`);

    // 2. Environment description (if applicable)
    if (request.environmentId) {
      const env = storyboardData.environmentRegistry?.find(e => e.id === request.environmentId);
      if (env) {
        contextParts.push(
          `Environment: ${env.name} - ${env.description}` +
          (env.visual_details ? `. ${env.visual_details}` : '') +
          (env.lighting ? `. Lighting: ${env.lighting}` : '')
        );
      }
    }

    // 3. Character descriptions (for characters in this shot)
    if (request.characterIds && request.characterIds.length > 0) {
      const chars = request.characterIds
        .map(id => storyboardData.characterRegistry?.find(c => c.id === id))
        .filter(Boolean)
        .map(c => `${c!.name}: ${c!.description}${c!.appearance ? ` (${c!.appearance})` : ''}`)
        .join('; ');
      if (chars) contextParts.push(`Characters: ${chars}`);
    }

    // 4. Object descriptions (for objects in this shot)
    if (request.objectIds && request.objectIds.length > 0) {
      const objs = request.objectIds
        .map(id => storyboardData.objectRegistry?.find(o => o.id === id))
        .filter(Boolean)
        .map(o => `${o!.name}: ${o!.description}${o!.visual_traits ? ` (${o!.visual_traits})` : ''}`)
        .join('; ');
      if (objs) contextParts.push(`Objects: ${objs}`);
    }

    // 5. Previous shots context (last 3 in same environment OR scene)
    if (request.previousShotsInContext && request.previousShotsInContext.length > 0) {
      const history = request.previousShotsInContext
        .map((s, i) => `Shot ${request.shotNumber - request.previousShotsInContext!.length + i}: ${s.description}`)
        .join('. ');
      contextParts.push(`Recent shots: ${history}`);
    }

    return contextParts.join('\n');
  }

  /**
   * Build a consistent image generation prompt that includes style context
   */
  private buildEnhancedPrompt(
    thumbnailPrompt: string,
    styleContext: StyleContext,
    hierarchicalContext: string,
    shotType: string
  ): string {
    const styleElements: string[] = [];

    if (styleContext.style_filters.length > 0) {
      styleElements.push(`Style: ${styleContext.style_filters.join(', ')}`);
    }
    if (styleContext.render_style) styleElements.push(`Rendering: ${styleContext.render_style}`);
    if (styleContext.lighting_style) styleElements.push(`Lighting: ${styleContext.lighting_style}`);
    if (styleContext.colour_palette) styleElements.push(`Color palette: ${styleContext.colour_palette}`);
    if (styleContext.camera_type) styleElements.push(`Camera: ${styleContext.camera_type}`);

    const systemContext = styleElements.length > 0 ? `[${styleElements.join(' | ')}]` : '';
    
    return [
      systemContext,
      hierarchicalContext,
      `Shot Type: ${shotType}`,
      thumbnailPrompt,
      'Single frame, cinematic still, high quality, detailed'
    ].filter(Boolean).join('. ');
  }

  /**
   * Generate a single thumbnail
   */
  async generateThumbnail(
    request: ThumbnailRequest,
    styleContext: StyleContext,
    storyboardData: StoryboardData
  ): Promise<ThumbnailResult> {
    try {
      // Build hierarchical context with all relevant information
      const hierarchicalContext = this.buildHierarchicalContext(request, storyboardData);
      
      // Build enhanced prompt with consistency
      const enhancedPrompt = this.buildEnhancedPrompt(
        request.thumbnailPrompt,
        styleContext,
        hierarchicalContext,
        request.shotType
      );

      console.log(`🎨 Generating thumbnail for ${request.shotId}:`, enhancedPrompt);

      // Generate image using OpenRouter/Gemini Image Generation Model
      const response = await this.openRouterService.generateImage({
        prompt: enhancedPrompt,
        model: 'google/gemini-2.5-flash-image-preview',
        temperature: 0.7,
        max_tokens: 200
      });

      console.log(`✅ Response received for ${request.shotId}`);

      // Extract image URL from response
      // Gemini returns images in response.choices[0].message.images array
      // Type guard to check if the choice has a message (for NonStreamingChoice)
      const firstChoice = response.choices?.[0];
      if (!firstChoice || !('message' in firstChoice)) {
        throw new Error('Invalid response format: no message in choice');
      }

      const images = firstChoice.message?.images;
      const imageUrl = images?.[0]?.image_url?.url;

      console.log(`🖼️ Image URL for ${request.shotId}:`, imageUrl ? 'Found' : 'Not found');

      if (!imageUrl) {
        console.error(`❌ No image URL found in response for ${request.shotId}`);
        console.error(`Response structure:`, {
          hasChoices: !!response.choices,
          hasMessage: !!firstChoice.message,
          hasImages: !!firstChoice.message?.images,
          imagesLength: firstChoice.message?.images?.length
        });
        
        throw new Error('No image URL in response');
      }

      return {
        shotId: request.shotId,
        imageUrl
      };
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${request.shotId}:`, error);
      return {
        shotId: request.shotId,
        imageUrl: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }


  /**
   * Generate thumbnails for multiple shots in batch
   * Uses controlled concurrency to avoid overwhelming the API
   */
  async generateBatch(
    requests: ThumbnailRequest[],
    styleContext: StyleContext,
    storyboardData: StoryboardData,
    onProgress?: (completed: number, total: number) => void,
    concurrency: number = 3
  ): Promise<Map<string, string | null>> {
    const results = new Map<string, string | null>();
    const total = requests.length;
    let completed = 0;

    // Process in batches with controlled concurrency
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      
      const batchPromises = batch.map(request => 
        this.generateThumbnail(request, styleContext, storyboardData)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        const request = batch[index];
        if (result.status === 'fulfilled') {
          results.set(request.shotId, result.value.imageUrl);
        } else {
          results.set(request.shotId, null);
          console.error(`Batch generation failed for ${request.shotId}:`, result.reason);
        }
        
        completed++;
        if (onProgress) {
          onProgress(completed, total);
        }
      });

      // Small delay between batches to respect rate limits
      if (i + concurrency < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Cancel any pending generation for a specific shot
   */
  cancelGeneration(shotId: string): void {
    this.generationQueue.delete(shotId);
  }

  /**
   * Clear all pending generations
   */
  clearAll(): void {
    this.generationQueue.clear();
  }
}

// Export singleton instance
export const thumbnailGenerator = new ThumbnailGeneratorService();

// Export types
export type { 
  StyleContext, 
  ThumbnailRequest, 
  ThumbnailResult,
  StoryboardData,
  Shot,
  Scene,
  Environment,
  Character,
  ObjectItem
};

