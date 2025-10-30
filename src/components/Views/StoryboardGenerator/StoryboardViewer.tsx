import React, { useState } from 'react';
import StoryboardView from './StoryboardView';
import TimelineView from './TimelineView';
import ViewFooter from './ViewFooter';
import { useThumbnailGeneration } from './hooks/useThumbnailGeneration';
import type { 
  ThumbnailRequest, 
  StyleContext, 
  StoryboardData as ServiceStoryboardData,
  Shot as ServiceShot,
  Scene as ServiceScene
} from './services/thumbnailGenerator';
import './StoryboardViewer.css';
import './StoryboardViewerEmbedded.css';

// Use types from service for consistency
type Shot = ServiceShot;
type Scene = ServiceScene;
type StoryboardData = ServiceStoryboardData;

interface StoryboardViewerProps {
  data: StoryboardData;
  onClose: () => void;
}

const StoryboardViewer: React.FC<StoryboardViewerProps> = ({ data, onClose }) => {
  const [viewMode, setViewMode] = useState<'storyboard' | 'timeline'>('timeline');
  
  const thumbnailState = useThumbnailGeneration();
  const {
    thumbnails,
    generating,
    progress,
    errors,
    generateSingle,
    generateAll,
    isGenerating
  } = thumbnailState;

  // Get previous shots in context for hierarchical context building
  const getPreviousShotsInContext = (
    currentShot: Shot,
    currentScene: Scene,
    sceneIdx: number,
    shotIdx: number
  ): Shot[] => {
    const previousShots: Shot[] = [];

    // If shot has environment, get last 3 shots from same environment
    if (currentShot.environment_id) {
      // Search backwards through all scenes
      for (let si = sceneIdx; si >= 0; si--) {
        const scene = data.scenes[si];
        const shots = si === sceneIdx ? scene.shots.slice(0, shotIdx) : scene.shots;

        for (let i = shots.length - 1; i >= 0; i--) {
          if (shots[i].environment_id === currentShot.environment_id) {
            previousShots.unshift(shots[i]);
            if (previousShots.length >= 3) return previousShots;
          }
        }
      }
    } else {
      // No environment: use last 3 shots from current scene
      previousShots.push(...currentScene.shots.slice(Math.max(0, shotIdx - 3), shotIdx));
    }

    return previousShots;
  };

  const handleGenerateAllThumbnails = () => {
    const requests: ThumbnailRequest[] = [];
    const styleContext: StyleContext = {
      camera_type: data.styleSettings?.camera_type,
      lighting_style: data.styleSettings?.lighting_style,
      colour_palette: data.styleSettings?.colour_palette,
      render_style: data.styleSettings?.render_style,
      aspect_ratio: data.styleSettings?.aspect_ratio,
      style_filters: data.input.style_filter
    };

    data.scenes.forEach((scene, sceneIdx) => {
      scene.shots.forEach((shot, shotIdx) => {
        const previousShots = getPreviousShotsInContext(shot, scene, sceneIdx, shotIdx);

        requests.push({
          shotId: shot.shot_id,
          shotNumber: shot.shot_number,
          thumbnailPrompt: shot.thumbnail_prompt,
          visualPrompt: shot.visual_prompt,
          shotType: shot.shot_type,
          sceneVisualPrompt: scene.visual_prompt,
          environmentId: shot.environment_id,
          characterIds: shot.characters,
          objectIds: shot.objects,
          previousShotsInContext: previousShots
        });
      });
    });

    generateAll(requests, styleContext, data);
  };

  const handleGenerateSingleThumbnail = (shot: Shot, scene: Scene, sceneIdx: number, shotIdx: number) => {
    const styleContext: StyleContext = {
      camera_type: data.styleSettings?.camera_type,
      lighting_style: data.styleSettings?.lighting_style,
      colour_palette: data.styleSettings?.colour_palette,
      render_style: data.styleSettings?.render_style,
      aspect_ratio: data.styleSettings?.aspect_ratio,
      style_filters: data.input.style_filter
    };

    const previousShots = getPreviousShotsInContext(shot, scene, sceneIdx, shotIdx);

    const request: ThumbnailRequest = {
      shotId: shot.shot_id,
      shotNumber: shot.shot_number,
      thumbnailPrompt: shot.thumbnail_prompt,
      visualPrompt: shot.visual_prompt,
      shotType: shot.shot_type,
      sceneVisualPrompt: scene.visual_prompt,
      environmentId: shot.environment_id,
      characterIds: shot.characters,
      objectIds: shot.objects,
      previousShotsInContext: previousShots
    };

    generateSingle(request, styleContext, data);
  };

  return (
    <div className="storyboard-viewer-embedded">
      <div className="storyboard-viewer-header-embedded">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={onClose} title="Clear storyboard">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="header-info">
              <h2>{data.input.user_prompt}</h2>
              <div className="header-meta">
                <span className="meta-item">
                  {data.scenes.length} scene{data.scenes.length !== 1 ? 's' : ''}
                </span>
                <span className="meta-separator">•</span>
                <span className="meta-item">
                  {data.scenes.reduce((acc, scene) => acc + scene.shots.length, 0)} shots
                </span>
                <span className="meta-separator">•</span>
                <span className="meta-item">
                  {data.input.duration_seconds}s duration
                </span>
              </div>
            </div>
          </div>
          <div className="header-right">
            {data.input.style_filter.map((style, idx) => (
              <span key={idx} className="style-badge">{style}</span>
            ))}
            <button 
              className="generate-thumbnails-button"
              onClick={handleGenerateAllThumbnails}
              disabled={isGenerating}
            >
              {isGenerating 
                ? `Generating... ${progress?.completed || 0}/${progress?.total || 0}`
                : '🎨 Generate All Thumbnails'
              }
            </button>
          </div>
        </div>
        
        {/* Debug Panel - Show errors */}
        {errors.size > 0 && (
          <div className="thumbnail-errors-panel">
            <strong>⚠️ Generation Errors ({errors.size}):</strong>
            <ul>
              {Array.from(errors.entries()).map(([shotId, error]) => (
                <li key={shotId}>
                  <code>{shotId}</code>: {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Conditionally render view based on viewMode */}
      {viewMode === 'timeline' ? (
        <TimelineView
          data={data}
          thumbnails={thumbnails}
          generating={generating}
          errors={errors}
          onGenerateSingleThumbnail={handleGenerateSingleThumbnail}
        />
      ) : (
        <StoryboardView
          data={data}
          thumbnails={thumbnails}
          generating={generating}
          errors={errors}
          onGenerateSingleThumbnail={handleGenerateSingleThumbnail}
        />
      )}

      {/* Style Settings Panel (Optional) */}
      {data.styleSettings && (
        <div className="style-settings-panel">
          <h4>Style Settings</h4>
          <div className="settings-grid">
            {data.styleSettings.camera_type && (
              <div className="setting-item">
                <span className="setting-label">Camera:</span>
                <span className="setting-value">{data.styleSettings.camera_type}</span>
              </div>
            )}
            {data.styleSettings.lighting_style && (
              <div className="setting-item">
                <span className="setting-label">Lighting:</span>
                <span className="setting-value">{data.styleSettings.lighting_style}</span>
              </div>
            )}
            {data.styleSettings.colour_palette && (
              <div className="setting-item">
                <span className="setting-label">Palette:</span>
                <span className="setting-value">{data.styleSettings.colour_palette}</span>
              </div>
            )}
            {data.styleSettings.render_style && (
              <div className="setting-item">
                <span className="setting-label">Render:</span>
                <span className="setting-value">{data.styleSettings.render_style}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Footer */}
      <ViewFooter viewMode={viewMode} onViewChange={setViewMode} />
    </div>
  );
};

export default StoryboardViewer;

