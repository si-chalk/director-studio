import React, { useState } from 'react';
import { calculateShotWidth } from './timelineConstants';
import './TimelineShot.css';

interface TimelineShotProps {
  shotNumber: number;
  shotId: string;
  durationMs: number;
  thumbnailUrl?: string | null;
  isGeneratingThumbnail?: boolean;
  onGenerateThumbnail?: () => void;
  onShowDetails?: () => void;
  error?: string;
}

const TimelineShot: React.FC<TimelineShotProps> = ({
  shotNumber,
  durationMs,
  thumbnailUrl = null,
  isGeneratingThumbnail = false,
  onGenerateThumbnail,
  onShowDetails,
  error
}) => {
  const [showInfo, setShowInfo] = useState(false);
  
  // Calculate card width using shared constants
  const cardWidth = calculateShotWidth(durationMs);

  return (
    <div 
      className="timeline-shot" 
      style={{ width: `${cardWidth}px` }}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div className="timeline-shot-content" onClick={onGenerateThumbnail}>
        {/* Shot Number Badge */}
        <div className="timeline-shot-number">{shotNumber}</div>
        
        {/* Info Button */}
        {showInfo && onShowDetails && (
          <button 
            className="timeline-info-button"
            onClick={(e) => {
              e.stopPropagation();
              onShowDetails();
            }}
            title="Show details"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={`Shot ${shotNumber}`}
            className="timeline-shot-thumbnail"
          />
        ) : (
          <div className="timeline-thumbnail-placeholder">
            {isGeneratingThumbnail ? (
              <div className="timeline-generating">
                <div className="timeline-spinner"></div>
              </div>
            ) : error ? (
              <div className="timeline-error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                  <path d="M12 8v4M12 15v.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="11" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                <path d="M4 20L10 14L14 18L20 12L28 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineShot;

