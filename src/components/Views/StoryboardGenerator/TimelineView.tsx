import React, { useRef, useEffect, useState } from 'react';
import TimelineShot from './TimelineShot';
import { calculateSceneWidth } from './timelineConstants';
import type { 
  StoryboardData as ServiceStoryboardData,
  Shot as ServiceShot,
  Scene as ServiceScene
} from './services/thumbnailGenerator';

type Shot = ServiceShot;
type Scene = ServiceScene;
type StoryboardData = ServiceStoryboardData;

interface TimelineViewProps {
  data: StoryboardData;
  thumbnails: Map<string, string | null>;
  generating: Set<string>;
  errors: Map<string, string>;
  onGenerateSingleThumbnail: (shot: Shot, scene: Scene, sceneIdx: number, shotIdx: number) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  data,
  thumbnails,
  generating,
  errors,
  onGenerateSingleThumbnail
}) => {
  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calculateDimensions = () => {
      if (!videoPlayerRef.current) return;

      const container = videoPlayerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Target aspect ratio 16:9
      const targetRatio = 16 / 9;
      const containerRatio = containerWidth / containerHeight;

      let width, height;

      if (containerRatio > targetRatio) {
        // Container is wider than 16:9, constrain by height
        height = containerHeight;
        width = height * targetRatio;
      } else {
        // Container is taller than 16:9, constrain by width
        width = containerWidth;
        height = width / targetRatio;
      }

      setVideoDimensions({ width, height });
    };

    // Calculate on mount
    calculateDimensions();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateDimensions);
    if (videoPlayerRef.current) {
      resizeObserver.observe(videoPlayerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="storyboard-viewer-content-embedded">
      {/* Video Player Preview */}
      <div className="video-player-container">
        <div className="video-player" ref={videoPlayerRef}>
          {/* Placeholder for video preview */}
          <div 
            className="video-placeholder"
            style={{
              width: videoDimensions.width > 0 ? `${videoDimensions.width}px` : '100%',
              height: videoDimensions.height > 0 ? `${videoDimensions.height}px` : '100%'
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="45" fill="rgba(255, 255, 255, 0.9)" />
              <path d="M50 40L80 60L50 80V40Z" fill="#7c3aed" />
            </svg>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <div className="video-controls-container">
        <div className="video-controls">
          <button className="play-button" title="Play preview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </button>
          <div className="time-container">
            <span className="time-current">0:00</span>
            <span className="time-separator"> / </span>
            <span className="time-total">0:{String(data.input.duration_seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Shot Timeline with Scene Labels */}
      <div className="shots-timeline-container">
        {/* Scene Indicators */}
        <div className="timeline-scene-indicators">
          {data.scenes.map((scene, sceneIdx) => {
            // Get shot durations and calculate scene width
            const shotDurations = scene.shots.map(shot => shot.duration_ms || 3000);
            const sceneWidth = calculateSceneWidth(shotDurations);
            
            return (
              <div 
                key={scene.scene_id} 
                className="scene-indicator"
                style={{ width: `${sceneWidth}px` }}
              >
                <div className="scene-indicator-label">Scene {sceneIdx + 1}</div>
                <div className="scene-indicator-title">{scene.title}</div>
              </div>
            );
          })}
        </div>

        {/* Shots Grid */}
        <div className="shots-grid">
          {data.scenes.map((scene) => (
            <React.Fragment key={scene.scene_id}>
              {/* Shots for this scene */}
              {scene.shots.map((shot, shotIdx) => (
                <TimelineShot
                  key={shot.shot_id}
                  shotId={shot.shot_id}
                  shotNumber={shot.shot_number}
                  durationMs={shot.duration_ms || 3000}
                  thumbnailUrl={thumbnails.get(shot.shot_id) || null}
                  isGeneratingThumbnail={generating.has(shot.shot_id)}
                  onGenerateThumbnail={() => onGenerateSingleThumbnail(shot, scene, data.scenes.indexOf(scene), shotIdx)}
                  error={errors.get(shot.shot_id)}
                  onShowDetails={() => {
                    // TODO: Implement details modal/flyout
                    console.log('Show details for shot:', shot.shot_id);
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

