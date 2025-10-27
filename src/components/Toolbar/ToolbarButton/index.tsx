import React, { useState, ReactNode } from "react";
import "./style.css";

interface ToolbarButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  width = 32,
  height = 32,
  isActive = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`element-toolbar-button ${isHovered ? "hovered" : ""} ${isActive ? "active" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={label}
      style={{ width, height }}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;
