import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { calculateShotWidth } from './timelineConstants';
import './ShotCard.css';

interface ShotCardProps {
  shotNumber: number;
  shotType: string;
  description: string;
  thumbnailPrompt: string;
  visualPrompt: string;
  characters?: string[];
  objects?: string[];
  durationMs?: number;
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
  durationMs = 3000,
  thumbnailUrl = null,
  isGeneratingThumbnail = false,
  onGenerateThumbnail,
  error
}) => {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Calculate card width using shared constants
  const cardWidth = calculateShotWidth(durationMs);
  const durationSeconds = durationMs / 1000;

  // Update flyout position when it opens
  useEffect(() => {
    if (isFlyoutOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const flyoutWidth = 380;
      const flyoutHeight = 500;
      
      // Default position: below and to the right of the button
      let top = buttonRect.bottom + 8;
      let left = buttonRect.right - flyoutWidth;
      
      // Adjust if flyout would go off the right edge
      if (left < 20) {
        left = 20;
      }
      
      // Adjust if flyout would go off the bottom
      if (top + flyoutHeight > window.innerHeight - 20) {
        top = Math.max(20, window.innerHeight - flyoutHeight - 20);
      }
      
      // Adjust if flyout would go off the left edge (show to the right instead)
      if (left + flyoutWidth > window.innerWidth - 20) {
        left = Math.max(20, window.innerWidth - flyoutWidth - 20);
      }
      
      setFlyoutPosition({ top, left });
    }
  }, [isFlyoutOpen]);

  return (
    <div className="shot-card" style={{ width: `${cardWidth}px` }} ref={cardRef}>
      <button 
        ref={buttonRef}
        className="edit-button"
        onClick={() => setIsFlyoutOpen(!isFlyoutOpen)}
        title="Edit shot"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.686 11.9447 1.59129C12.1735 1.49657 12.419 1.44775 12.6663 1.44775C12.9137 1.44775 13.1592 1.49657 13.3879 1.59129C13.6167 1.686 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5031 2.84055 14.552 3.08605 14.552 3.33337C14.552 3.58069 14.5031 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.99967 14L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Flyout Portal */}
      {isFlyoutOpen && createPortal(
        <>
          <div className="flyout-overlay" onClick={() => setIsFlyoutOpen(false)} />
          <div 
            className="flyout flyout-popover"
            style={{
              top: `${flyoutPosition.top}px`,
              left: `${flyoutPosition.left}px`
            }}
          >
            <div className="flyout-header">
              <h3>Edit Shot {shotNumber}</h3>
              <button className="flyout-close" onClick={() => setIsFlyoutOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="flyout-content">
              <div className="flyout-field">
                <label>Shot Type</label>
                <select className="flyout-select" value={shotType}>
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
              
              <div className="flyout-field">
                <label>Duration</label>
                <div className="flyout-info">{durationSeconds.toFixed(1)}s ({durationMs}ms)</div>
              </div>

              {characters && characters.length > 0 && (
                <div className="flyout-field">
                  <label>Characters</label>
                  <div className="flyout-info">{characters.join(', ')}</div>
                </div>
              )}

              {objects && objects.length > 0 && (
                <div className="flyout-field">
                  <label>Objects</label>
                  <div className="flyout-info">{objects.join(', ')}</div>
                </div>
              )}

              <div className="flyout-field">
                <label>Description</label>
                <textarea 
                  className="flyout-textarea" 
                  value={description}
                  rows={6}
                  placeholder="Shot description..."
                />
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      <div className="shot-thumbnail" onClick={onGenerateThumbnail}>
        {/* Shot Number Badge */}
        <div className="shot-number-badge">{shotNumber}</div>
        
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
    </div>
  );
};

export default ShotCard;

