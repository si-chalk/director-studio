import { useState, useCallback } from 'react';
import { thumbnailGenerator } from '../services/thumbnailGenerator';
import type { ThumbnailRequest, StyleContext, StoryboardData } from '../services/thumbnailGenerator';

interface ThumbnailState {
  thumbnails: Map<string, string | null>;
  generating: Set<string>;
  progress: { completed: number; total: number } | null;
  errors: Map<string, string>;
}

export function useThumbnailGeneration() {
  const [state, setState] = useState<ThumbnailState>({
    thumbnails: new Map(),
    generating: new Set(),
    progress: null,
    errors: new Map()
  });

  /**
   * Generate a single thumbnail
   */
  const generateSingle = useCallback(async (
    request: ThumbnailRequest,
    styleContext: StyleContext,
    storyboardData: StoryboardData
  ) => {
    console.log(`🎬 Starting generation for ${request.shotId}`);
    
    setState(prev => ({
      ...prev,
      generating: new Set(prev.generating).add(request.shotId),
      errors: new Map(prev.errors)
    }));

    try {
      const result = await thumbnailGenerator.generateThumbnail(request, styleContext, storyboardData);
      
      console.log(`📊 Generation result for ${request.shotId}:`, {
        hasUrl: !!result.imageUrl,
        hasError: !!result.error,
        url: result.imageUrl?.substring(0, 100)
      });
      
      setState(prev => {
        const newGenerating = new Set(prev.generating);
        newGenerating.delete(request.shotId);
        
        const newThumbnails = new Map(prev.thumbnails);
        newThumbnails.set(request.shotId, result.imageUrl);
        
        const newErrors = new Map(prev.errors);
        if (result.error) {
          console.error(`❌ Error for ${request.shotId}:`, result.error);
          newErrors.set(request.shotId, result.error);
        } else {
          newErrors.delete(request.shotId);
        }

        console.log(`💾 State updated for ${request.shotId}. Total thumbnails:`, newThumbnails.size);

        return {
          ...prev,
          thumbnails: newThumbnails,
          generating: newGenerating,
          errors: newErrors
        };
      });

      return result.imageUrl;
    } catch (error) {
      console.error(`❌ Exception during generation for ${request.shotId}:`, error);
      
      setState(prev => {
        const newGenerating = new Set(prev.generating);
        newGenerating.delete(request.shotId);
        
        const newErrors = new Map(prev.errors);
        newErrors.set(request.shotId, error instanceof Error ? error.message : 'Generation failed');

        return {
          ...prev,
          generating: newGenerating,
          errors: newErrors
        };
      });

      return null;
    }
  }, []);

  /**
   * Generate all thumbnails for a storyboard
   */
  const generateAll = useCallback(async (
    requests: ThumbnailRequest[],
    styleContext: StyleContext,
    storyboardData: StoryboardData,
    concurrency: number = 3
  ) => {
    setState(prev => ({
      ...prev,
      generating: new Set(requests.map(r => r.shotId)),
      progress: { completed: 0, total: requests.length },
      errors: new Map()
    }));

    try {
      const results = await thumbnailGenerator.generateBatch(
        requests,
        styleContext,
        storyboardData,
        (completed, total) => {
          setState(prev => ({
            ...prev,
            progress: { completed, total }
          }));
        },
        concurrency
      );

      setState(prev => ({
        ...prev,
        thumbnails: new Map([...prev.thumbnails, ...results]),
        generating: new Set(),
        progress: null
      }));

      return results;
    } catch (error) {
      console.error('Batch generation failed:', error);
      setState(prev => ({
        ...prev,
        generating: new Set(),
        progress: null
      }));
      return new Map();
    }
  }, []);

  /**
   * Clear a specific thumbnail
   */
  const clearThumbnail = useCallback((shotId: string) => {
    setState(prev => {
      const newThumbnails = new Map(prev.thumbnails);
      newThumbnails.delete(shotId);
      return {
        ...prev,
        thumbnails: newThumbnails
      };
    });
  }, []);

  /**
   * Clear all thumbnails
   */
  const clearAll = useCallback(() => {
    thumbnailGenerator.clearAll();
    setState({
      thumbnails: new Map(),
      generating: new Set(),
      progress: null,
      errors: new Map()
    });
  }, []);

  return {
    thumbnails: state.thumbnails,
    generating: state.generating,
    progress: state.progress,
    errors: state.errors,
    generateSingle,
    generateAll,
    clearThumbnail,
    clearAll,
    isGenerating: state.generating.size > 0
  };
}

