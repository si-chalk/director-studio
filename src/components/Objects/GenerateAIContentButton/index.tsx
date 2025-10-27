import React from 'react';
import './style.css';
import SparkleIcon from './assets/sparkle-icon.svg?react';

interface GenerateAIContentButtonProps {
  text: string;
  showDropdown?: boolean;
  onGenerateClick?: () => void;
  onDropdownClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const GenerateAIContentButton: React.FC<GenerateAIContentButtonProps> = ({
  text,
  showDropdown = false,
  onGenerateClick,
  onDropdownClick,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`generate-ai-content-button-group ${className}`}>
      <button
        className={`generate-ai-content-main-button ${!showDropdown ? 'no-dropdown' : ''}`}
        onClick={onGenerateClick}
        disabled={disabled}
        type="button"
      >
        <div className="generate-ai-content-icon">
          <SparkleIcon />
        </div>
        <span className="generate-ai-content-text">{text}</span>
      </button>
      {showDropdown && (
        <button
          className="generate-ai-content-dropdown-button"
          onClick={onDropdownClick}
          disabled={disabled}
          type="button"
          aria-label="More options"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GenerateAIContentButton;
