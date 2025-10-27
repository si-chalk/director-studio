import React, { useState } from 'react';
import './ShotCard.css';

interface ShotCardProps {
  shotNumber: number;
  shotType: string;
  description: string;
  thumbnailPrompt: string;
  visualPrompt: string;
  characters?: string[];
  objects?: string[];
  durationS?: number;
  thumbnailUrl?: string | null;
  isGeneratingThumbnail?: boolean;
  onGenerateThumbnail?: () => void;
  error?: string;
}

const ShotCard: React.FC<ShotCardProps> = ({
  shotNumber,
  shotType,
  description,
  thumbnailPrompt,
  visualPrompt,
  characters = [],
  objects = [],
  durationS,
  thumbnailUrl = null,
  isGeneratingThumbnail = false,
  onGenerateThumbnail,
  error
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVideo = () => {
    console.log('Generate video for shot:', shotNumber, {
      visualPrompt,
      characters,
      objects,
      durationS
    });
    // TODO: Implement video generation
  };

  return (
    <div className="shot-card">
      <div className="shot-card-header">
        <span className="shot-number">Shot {shotNumber}</span>
      </div>

      <div className="shot-thumbnail" onClick={onGenerateThumbnail}>
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`Shot ${shotNumber}`}
            onError={(e) => {
              console.error(`Failed to load thumbnail for shot ${shotNumber}:`, thumbnailUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log(`✅ Thumbnail loaded successfully for shot ${shotNumber}`);
            }}
          />
        ) : (
          <div className="thumbnail-placeholder">
            {isGeneratingThumbnail ? (
              <div className="generating-overlay">
                <div className="spinner"></div>
                <span className="generating-text">Generating...</span>
              </div>
            ) : error ? (
              <div className="thumbnail-error">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#ef4444" strokeWidth="2"/>
                  <path d="M24 16v8M24 30v2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="error-text">Failed</span>
                <span className="error-details">{error}</span>
              </div>
            ) : (
              <>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="16" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="22" cy="28" r="4" fill="currentColor" opacity="0.3"/>
                  <path d="M8 40L20 28L28 36L40 24L56 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {onGenerateThumbnail && (
                  <div className="generate-thumbnail-hint">Click to generate</div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <button 
        className="generate-video-btn"
        onClick={handleGenerateVideo}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM8 3.5C10.4853 3.5 12.5 5.51472 12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5Z" fill="currentColor"/>
          <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor"/>
        </svg>
        Generate video
      </button>

      <div className="shot-description">
        {description}
      </div>

      <div className="shot-footer">
        <select className="shot-type-select" value={shotType} disabled>
          <option>{shotType}</option>
        </select>
        
        {durationS && (
          <span className="shot-duration">{durationS}s</span>
        )}
      </div>

      {(characters.length > 0 || objects.length > 0) && (
        <div className="shot-metadata">
          {characters.length > 0 && (
            <div className="metadata-tag">
              <span className="metadata-label">Characters:</span>
              <span className="metadata-value">{characters.join(', ')}</span>
            </div>
          )}
          {objects.length > 0 && (
            <div className="metadata-tag">
              <span className="metadata-label">Objects:</span>
              <span className="metadata-value">{objects.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShotCard;

