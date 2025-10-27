import { OpenRouterService } from "@canva-ct/genai/openrouter";
import type { ImageGenerationOptions } from "@canva-ct/genai/openrouter";

// Create OpenRouter service instance
const openRouterService = new OpenRouterService();

/**
 * Service for generating images using Google Gemini via OpenRouter
 */
class ImageGenerationService {
  /**
   * Generate a single image from a text prompt
   * @param prompt The text prompt for image generation
   * @returns The generated image URL or base64 data
   */
  async generateImage(prompt: string): Promise<string> {
    try {
      console.log("🎨 Generating image with prompt:", prompt);

      const options: ImageGenerationOptions = {
        prompt,
        model: "google/gemini-2.5-flash-image-preview",
        temperature: 0.7,
        max_tokens: 200,
        systemMessage: "Generate high-quality, detailed images based on the prompt",
      };

      const response = await openRouterService.generateImage(options);

      // Extract image from response
      const content = response.choices[0]?.message?.content;
      const images = response.choices[0]?.message?.images;

      console.log("✅ Image generation response:", { content, images });

      // Check if images array exists (some responses include images directly)
      if (images && images.length > 0) {
        return images[0].image_url.url;
      }

      // Otherwise, parse content for image URLs or base64
      if (typeof content === "string") {
        // Try to extract image URL from markdown format ![](url)
        const markdownMatch = content.match(/!\[.*?\]\((.*?)\)/);
        if (markdownMatch) {
          return markdownMatch[1];
        }

        // Try to extract raw URL
        const urlMatch = content.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          return urlMatch[0];
        }

        // If content looks like base64, return it with data URI prefix
        if (content.startsWith("data:image/")) {
          return content;
        }

        // If it's raw base64, add the prefix
        if (content.length > 100 && !content.includes(" ")) {
          return `data:image/png;base64,${content}`;
        }
      }

      throw new Error("No image URL found in response");
    } catch (error) {
      console.error("❌ Image generation error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();
