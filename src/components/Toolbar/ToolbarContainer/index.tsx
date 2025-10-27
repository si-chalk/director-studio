import React, { ReactElement } from "react";
import CanvasToolbar from "../CanvasToolbar";
import TextToolbar from "../TextToolbar";
import ImageToolbar from "../ImageToolbar";
import ShapeToolbar from "../ShapeToolbar";
import VideoToolbar from "../VideoToolbar";
import NavigationMenuToolbar from "../NavigationMenuToolbar";
import "./style.css";

interface ToolbarContainerProps {
  selectedType: string | null;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({ selectedType }) => {
  let toolbar: ReactElement | null = null;

  switch (selectedType) {
    case "canvas":
      toolbar = <CanvasToolbar />;
      break;
    case "text":
      toolbar = <TextToolbar />;
      break;
    case "image":
      toolbar = <ImageToolbar />;
      break;
    case "shape":
      toolbar = <ShapeToolbar />;
      break;
    case "video":
      toolbar = <VideoToolbar />;
      break;
    case "navigation-menu":
      toolbar = <NavigationMenuToolbar />;
      break;
    default:
      toolbar = null;
  }

  return <div className="toolbar-container">{toolbar}</div>;
};

export default ToolbarContainer;
