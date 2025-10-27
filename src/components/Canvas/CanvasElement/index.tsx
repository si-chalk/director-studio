import React, { useState } from "react";
import "./style.css";

// Import placeholder images
import ImagePlaceholder from "@assets/icons/canvas-icons/image-placeholder.svg";
import ShapePlaceholder from "@assets/icons/canvas-icons/shape-placeholder.svg";
import TextPlaceholder from "@assets/icons/canvas-icons/text-placeholder.svg";
import VideoPlaceholder from "@assets/icons/canvas-icons/video-placeholder.svg";
import ToolbarSelection from "@assets/icons/toolbars/toolbar-selection.svg";

interface CanvasElementProps {
  type: "image" | "shape" | "text" | "video";
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  isSelected?: boolean;
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  type,
  style,
  onClick,
  isSelected = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const getImagePath = (): string => {
    switch (type) {
      case "image":
        return ImagePlaceholder;
      case "shape":
        return ShapePlaceholder;
      case "text":
        return TextPlaceholder;
      case "video":
        return VideoPlaceholder;
      default:
        return "";
    }
  };

  const handleClick = (event: React.MouseEvent): void => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleMouseEnter = (): void => {
    setIsHovering(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovering(false);
  };

  const handleToolbarClick = (event: React.MouseEvent): void => {
    // Prevent clicks on the toolbar from deselecting the element
    event.stopPropagation();
  };

  // Create resize handles when element is selected
  const renderResizeHandles = (): React.ReactNode => {
    if (!isSelected) return null;

    return (
      <>
        {/* Corner handles */}
        <div className="resize-handle corner top-left"></div>
        <div className="resize-handle corner top-right"></div>
        <div className="resize-handle corner bottom-left"></div>
        <div className="resize-handle corner bottom-right"></div>

        {/* Side handles */}
        <div className="resize-handle side top"></div>
        <div className="resize-handle side right"></div>
        <div className="resize-handle side bottom"></div>
        <div className="resize-handle side left"></div>

        {/* Rotation handle */}
        <div className="rotate-handle"></div>

        {/* Selection toolbar */}
        <div className="selection-toolbar" onClick={handleToolbarClick}>
          <img src={ToolbarSelection} alt="Selection Toolbar" className="selection-toolbar-svg" />
        </div>
      </>
    );
  };

  const elementClassName = `canvas-element ${type}-element ${
    isHovering && !isSelected ? "hovering" : ""
  } ${isSelected ? "selected" : ""}`;

  return (
    <div
      className={elementClassName}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={getImagePath()} alt={`${type} element`} />
      {renderResizeHandles()}
    </div>
  );
};

export default CanvasElement;
