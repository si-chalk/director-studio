# Thumbnail Generation System

## Overview

The thumbnail generation system creates visually consistent preview images for each shot in a storyboard. It uses Google Gemini's image generation capabilities via the OpenRouter API to maintain style consistency across all shots.

## Architecture

### Components

1. **ThumbnailGeneratorService** (`services/thumbnailGenerator.ts`)
   - Core service handling API calls
   - Builds context-aware prompts
   - Manages generation queue and rate limiting

2. **useThumbnailGeneration Hook** (`hooks/useThumbnailGeneration.ts`)
   - React hook for state management
   - Handles single and batch generation
   - Provides progress tracking

3. **StoryboardViewer** (integrated)
   - "Generate All Thumbnails" button
   - Batch generation with progress indicator
   - Individual shot regeneration

4. **ShotCard** (updated)
   - Displays generated thumbnails
   - Shows loading state during generation
   - Click-to-generate individual thumbnails

## Consistency Strategy

### 1. Style Context Propagation

Every thumbnail generation includes consistent style information:

```typescript
interface StyleContext {
  camera_type?: string;          // e.g., "35mm", "DSLR", "iPhone"
  lighting_style?: string;        // e.g., "Natural", "Studio", "Moody"
  colour_palette?: string;        // e.g., "Warm tones", "Desaturated"
  render_style?: string;          // e.g., "Photorealistic", "Sketch"
  aspect_ratio?: string;          // e.g., "16:9", "9:16"
  style_filters: string[];        // e.g., ["Cinematic", "Storyboard"]
}
```

### 2. Hierarchical Prompt Building

Prompts are built with multiple layers of context:

```
[Style Context] → [Thumbnail Prompt] → [Scene Context] → [Shot Type] → [Technical Specs]
```

**Example:**
```
[Style: Cinematic, Storyboard sketch | Lighting: Soft dawn | Camera: 35mm]
Macro sketch of metallic gears under warm light, shallow depth, analog texture
Scene context: Workshop interior; ambient lighting; consistent character design
Shot type: Close Up
Single frame, cinematic still, high quality, detailed
```

### 3. Scene-Level Consistency

Each shot includes its scene's visual prompt to maintain:
- Lighting continuity
- Location consistency
- Character appearance
- Environmental details

### 4. Character & Object Registry

The system tracks:
- **Characters**: Appearance, wardrobe, age, defining features
- **Objects**: Visual traits, materials, consistent design

These are referenced in prompts to ensure the same character/object looks identical across shots.

## Usage

### Batch Generation (All Thumbnails)

```typescript
// Automatic via "Generate All Thumbnails" button
// Generates all shots with progress tracking
```

**Flow:**
1. Click "🎨 Generate All Thumbnails" button
2. System extracts style context from storyboard
3. Builds requests for all shots
4. Generates in batches of 3 (configurable)
5. Shows progress: "Generating... 5/12"
6. Thumbnails appear as they complete

### Individual Generation

```typescript
// Click any shot card thumbnail placeholder
// Regenerates single thumbnail with same consistency
```

**Flow:**
1. Click on any shot's thumbnail area
2. Shows spinner with "Generating..." text
3. Uses same style context as batch generation
4. Thumbnail appears when complete

## Technical Details

### Rate Limiting

- **Batch Concurrency**: 3 simultaneous generations
- **Delay Between Batches**: 1 second
- Prevents API rate limit errors
- Configurable per implementation

### Error Handling

```typescript
{
  shotId: string;
  imageUrl: string | null;
  error?: string;  // If generation fails
}
```

Failed generations:
- Don't block other generations
- Show placeholder with error state
- Can be retried individually

### Image URL Extraction

The system handles multiple response formats:
- Direct URLs (https://...)
- Markdown image syntax: `![alt](url)`
- Base64 data URLs: `data:image/...;base64,...`

### Memory Management

- Thumbnails stored in React state Map
- Cleared when storyboard is reset
- No persistent storage (regenerate on reload)

## Customization

### Adjusting Consistency

**More Consistency** (stricter style):
```typescript
temperature: 0.3  // Lower temperature
max_tokens: 200   // Shorter responses
```

**More Variety** (creative freedom):
```typescript
temperature: 0.9  // Higher temperature
max_tokens: 400   // Longer, more detailed prompts
```

### Style Priority

Adjust prompt order to prioritize different aspects:

```typescript
// Prioritize style over content
`[${styleElements}] ${thumbnailPrompt}`

// Prioritize content over style
`${thumbnailPrompt} [${styleElements}]`
```

### Batch Size

```typescript
// Generate more at once (faster but more memory)
generateAll(requests, styleContext, 6);

// Generate fewer at once (slower but safer)
generateAll(requests, styleContext, 1);
```

## Best Practices

### 1. Consistent Style Filters

Choose complementary styles:
- ✅ "Cinematic" + "Film noir"
- ✅ "Storyboard sketch" + "Hand-drawn"
- ❌ "Photorealistic" + "Cartoon"

### 2. Detailed Style Settings

Provide specific styleSettings in storyboard:
```json
{
  "styleSettings": {
    "camera_type": "35mm film camera",
    "lighting_style": "Golden hour, warm backlighting",
    "colour_palette": "Warm oranges, deep browns, cream whites",
    "render_style": "Sketch with crosshatching, analog texture"
  }
}
```

### 3. Scene Visual Prompts

Include consistent visual elements:
```
"Storyboard sketch-style; soft morning light; warm tone; 
nostalgic craftsmanship; character Alex (early 30s, focused); 
wooden desk, metallic tools, analog feel."
```

### 4. Thumbnail Prompts

Be specific but concise:
- ✅ "Macro sketch of metallic gears under warm light"
- ❌ "Gears"
- ❌ "Super detailed ultra realistic 8K HDR gears..." (too long)

## Future Enhancements

### Potential Improvements

1. **Thumbnail Caching**
   - Store generated URLs in localStorage
   - Persist across sessions
   - Invalidate on storyboard changes

2. **Reference Images**
   - Upload reference for characters/objects
   - Use image-to-image generation
   - Ensure exact visual match

3. **Style Templates**
   - Pre-built style combinations
   - One-click consistent aesthetics
   - Community-shared templates

4. **Batch Optimization**
   - Smart batching based on scene
   - Parallel scene generation
   - Progressive enhancement

5. **Quality Controls**
   - User rating system
   - Auto-regenerate low-quality
   - Learn preferences over time

## Troubleshooting

### Inconsistent Results

**Problem**: Thumbnails don't look similar
**Solutions**:
- Lower temperature (0.2-0.4)
- Add more detail to style_filters
- Use specific character descriptions
- Include reference images (future)

### Generation Failures

**Problem**: Some thumbnails fail to generate
**Solutions**:
- Check API quota/limits
- Retry individual shots
- Simplify complex prompts
- Verify network connection

### Slow Generation

**Problem**: Takes too long
**Solutions**:
- Increase batch concurrency (with caution)
- Reduce max_tokens
- Use faster model
- Generate only key shots

## API Costs

Approximate costs (varies by provider):
- Per thumbnail: ~$0.01-0.05
- 30-shot storyboard: ~$0.30-1.50
- Batch discounts may apply

## Conclusion

This thumbnail generation system provides:
- ✅ Visual consistency across all shots
- ✅ Style-aware image generation
- ✅ Flexible batch and individual generation
- ✅ Progress tracking and error handling
- ✅ Scalable architecture for future enhancements

The key to consistency is the hierarchical prompt structure that includes global style settings, scene context, and shot-specific details in every generation request.

