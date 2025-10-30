import React from 'react';
import StoryboardCard from './StoryboardCard';
import type { 
  StoryboardData as ServiceStoryboardData,
  Shot as ServiceShot,
  Scene as ServiceScene
} from './services/thumbnailGenerator';

type Shot = ServiceShot;
type Scene = ServiceScene;
type StoryboardData = ServiceStoryboardData;

interface StoryboardViewProps {
  data: StoryboardData;
  thumbnails: Map<string, string | null>;
  generating: Set<string>;
  errors: Map<string, string>;
  onGenerateSingleThumbnail: (shot: Shot, scene: Scene, sceneIdx: number, shotIdx: number) => void;
}

const StoryboardView: React.FC<StoryboardViewProps> = ({
  data,
  thumbnails,
  generating,
  errors,
  onGenerateSingleThumbnail
}) => {
  return (
    <div className="storyboard-viewer-content-embedded storyboard-view-mode">
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
              <StoryboardCard
                key={shot.shot_id}
                shotNumber={shot.shot_number}
                shotType={shot.shot_type}
                description={shot.description}
                durationMs={shot.duration_ms}
                thumbnailUrl={thumbnails.get(shot.shot_id) || null}
                isGeneratingThumbnail={generating.has(shot.shot_id)}
                onGenerateThumbnail={() => onGenerateSingleThumbnail(shot, scene, sceneIdx, shotIdx)}
                error={errors.get(shot.shot_id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryboardView;

