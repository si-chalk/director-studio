import React from 'react';
import './StoryboardCard.css';

interface StoryboardCardProps {
  shotNumber: number;
  shotType: string;
  description: string;
  durationMs: number;
  thumbnailUrl?: string | null;
  isGeneratingThumbnail?: boolean;
  onGenerateThumbnail?: () => void;
  error?: string;
}

const StoryboardCard: React.FC<StoryboardCardProps> = ({
  shotNumber,
  shotType,
  description,
  durationMs,
  thumbnailUrl = null,
  isGeneratingThumbnail = false,
  onGenerateThumbnail,
  error
}) => {
  const durationSeconds = durationMs / 1000;

  return (
    <div className="storyboard-card">
      {/* Shot Number Header */}
      <div className="storyboard-card-header">
        <span className="storyboard-shot-number">Shot {shotNumber}</span>
      </div>

      {/* Thumbnail Area */}
      <div className="storyboard-thumbnail" onClick={onGenerateThumbnail}>
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`Shot ${shotNumber}`}
            className="storyboard-thumbnail-image"
          />
        ) : (
          <div className="storyboard-thumbnail-placeholder">
            {isGeneratingThumbnail ? (
              <div className="storyboard-generating">
                <div className="storyboard-spinner"></div>
                <span className="storyboard-generating-text">Generating...</span>
              </div>
            ) : error ? (
              <div className="storyboard-error">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#ef4444" strokeWidth="2"/>
                  <path d="M24 16v8M24 30v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="storyboard-error-text">Failed</span>
              </div>
            ) : (
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="16" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="22" cy="28" r="4" fill="currentColor" opacity="0.3"/>
                <path d="M8 40L20 28L28 36L40 24L56 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Generate Video Button */}
      <button className="generate-video-button" disabled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.5 7.5L18 8.5L14 13L15.5 18L10 15L4.5 18L6 13L2 8.5L7.5 7.5L10 2Z" fill="currentColor"/>
        </svg>
        <span>Generate video</span>
      </button>

      {/* Description */}
      <div className="storyboard-description">
        {description}
      </div>

      {/* Shot Type Dropdown */}
      <div className="storyboard-shot-type">
        <select className="shot-type-select" value={shotType} disabled>
          <option>Close Up</option>
          <option>Extreme Close Up</option>
          <option>Medium Shot</option>
          <option>Medium Close Up</option>
          <option>Wide Shot</option>
          <option>Extreme Wide</option>
          <option>Insert</option>
          <option>Overhead</option>
          <option>POV</option>
          <option>Tracking</option>
          <option>Push In</option>
          <option>Pull Out</option>
          <option>Tilt</option>
          <option>Pan</option>
          <option>Static</option>
        </select>
      </div>
    </div>
  );
};

export default StoryboardCard;

