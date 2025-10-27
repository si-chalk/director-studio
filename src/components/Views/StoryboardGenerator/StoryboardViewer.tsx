import React, { useEffect } from 'react';
import ShotCard from './ShotCard';
import { useThumbnailGeneration } from './hooks/useThumbnailGeneration';
import type { ThumbnailRequest, StyleContext } from './services/thumbnailGenerator';
import './StoryboardViewer.css';
import './StoryboardViewerEmbedded.css';

interface Shot {
  shot_id: string;
  shot_number: number;
  shot_type: string;
  description: string;
  visual_prompt: string;
  thumbnail_prompt: string;
  duration_s?: number;
  characters?: string[];
  objects?: string[];
  environment_id?: string;
}

interface Scene {
  scene_id: string;
  title: string;
  description: string;
  visual_prompt: string;
  time_range?: {
    start_s: number;
    end_s: number;
  };
  shots: Shot[];
}

interface Character {
  id: string;
  name: string;
  description: string;
  appearance?: string;
  wardrobe?: string;
  age_range?: string;
}

interface ObjectItem {
  id: string;
  name: string;
  description: string;
  visual_traits?: string;
}

interface Environment {
  id: string;
  name: string;
  description: string;
  visual_details?: string;
  lighting?: string;
}

interface StyleSettings {
  camera_type?: string;
  lighting_style?: string;
  colour_palette?: string;
  render_style?: string;
  aspect_ratio?: string;
  notes?: string;
}

interface StoryboardData {
  version?: string;
  generated_at?: string;
  input: {
    user_prompt: string;
    style_filter: string[];
    duration_seconds: number;
  };
  styleSettings?: StyleSettings;
  characterRegistry?: Character[];
  objectRegistry?: ObjectItem[];
  environmentRegistry?: Environment[];
  scenes: Scene[];
}

interface StoryboardViewerProps {
  data: StoryboardData;
  onClose: () => void;
}

const StoryboardViewer: React.FC<StoryboardViewerProps> = ({ data, onClose }) => {
  const {
    thumbnails,
    generating,
    progress,
    errors,
    generateSingle,
    generateAll,
    isGenerating
  } = useThumbnailGeneration();

  const getCharacterName = (id: string): string => {
    const character = data.characterRegistry?.find(c => c.id === id);
    return character?.name || id;
  };

  const getObjectName = (id: string): string => {
    const object = data.objectRegistry?.find(o => o.id === id);
    return object?.name || id;
  };

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

      <div className="storyboard-viewer-content-embedded">
        {data.scenes.map((scene, sceneIdx) => (
          <div key={scene.scene_id} className="scene-section">
            <div className="scene-header">
              <div className="scene-number">Scene {sceneIdx + 1}</div>
              <h3 className="scene-title">{scene.title}</h3>
              <p className="scene-description">{scene.description}</p>
              {scene.time_range && (
                <div className="scene-time-range">
                  {scene.time_range.start_s}s - {scene.time_range.end_s}s
                </div>
              )}
            </div>

            <div className="shots-container">
              {scene.shots.map((shot, shotIdx) => (
                <ShotCard
                  key={shot.shot_id}
                  shotNumber={shot.shot_number}
                  shotType={shot.shot_type}
                  description={shot.description}
                  thumbnailPrompt={shot.thumbnail_prompt}
                  visualPrompt={shot.visual_prompt}
                  characters={shot.characters?.map(getCharacterName)}
                  objects={shot.objects?.map(getObjectName)}
                  durationS={shot.duration_s}
                  thumbnailUrl={thumbnails.get(shot.shot_id) || null}
                  isGeneratingThumbnail={generating.has(shot.shot_id)}
                  onGenerateThumbnail={() => handleGenerateSingleThumbnail(shot, scene, sceneIdx, shotIdx)}
                  error={errors.get(shot.shot_id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default StoryboardViewer;

