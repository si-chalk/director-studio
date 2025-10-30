import React from 'react';

interface ViewFooterProps {
  viewMode: 'storyboard' | 'timeline';
  onViewChange: (mode: 'storyboard' | 'timeline') => void;
}

const ViewFooter: React.FC<ViewFooterProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="storyboard-viewer-footer">
      <div className="footer-left">
        {/* Placeholder for future zoom controls */}
      </div>
      
      <div className="footer-right">
        <button
          className="view-toggle-button"
          onClick={() => onViewChange(viewMode === 'storyboard' ? 'timeline' : 'storyboard')}
          title={`Switch to ${viewMode === 'storyboard' ? 'Timeline' : 'Storyboard'} view`}
        >
          {viewMode === 'storyboard' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="4" width="14" height="2" rx="0.5" fill="currentColor"/>
                <rect x="1" y="7" width="14" height="2" rx="0.5" fill="currentColor"/>
                <rect x="1" y="10" width="14" height="2" rx="0.5" fill="currentColor"/>
              </svg>
              <span>Timeline View</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
              </svg>
              <span>Storyboard View</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ViewFooter;

