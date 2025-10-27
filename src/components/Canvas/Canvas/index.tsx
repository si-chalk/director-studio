import React, { useState, useRef, useEffect } from "react";
import CanvasElement from "../CanvasElement";
import "./style.css";

interface GradientConfig {
  type: "linear" | "circular" | "radial";
  angle?: string;
  position?: string;
  colors: string[];
}

interface ElementData {
  type: "image" | "shape" | "text" | "video";
  style?: React.CSSProperties;
}

interface CanvasProps {
  id: string;
  content?: string;
  color?: string;
  gradient?: GradientConfig | null;
  elements?: ElementData[];
  onSelectElement?: (type: string | null) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  id,
  content = "",
  color = "white",
  gradient = null,
  elements = [],
  onSelectElement,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add document-level click listener to detect clicks outside the canvas
    const handleDocumentClick = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        setIsSelected(false);
        setSelectedElementId(null);
        // Notify parent that nothing is selected
        if (onSelectElement) {
          onSelectElement(null);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    // Cleanup function
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [onSelectElement]);

  const handleCanvasClick = (event: React.MouseEvent) => {
    // Only handle clicks directly on the canvas (not on elements)
    if (
      event.target === canvasRef.current ||
      (event.target as HTMLElement).classList.contains("canvas-content")
    ) {
      setIsSelected(true);
      setSelectedElementId(null);
      // Remove hover class when selected
      setIsHovering(false);

      // Notify parent that canvas is selected
      if (onSelectElement) {
        onSelectElement("canvas");
      }

      // Prevent click from bubbling to document
      event.stopPropagation();
    }
  };

  const handleMouseEnter = () => {
    if (!isSelected) {
      setIsHovering(true);
    } else {
      console
        .log
        // "Mouse entered the canvas - already selected, not adding hover"
        ();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleElementClick = (event: React.MouseEvent, type: string, index: number) => {
    event.stopPropagation();

    // Set this element as selected
    setSelectedElementId(index);

    // Canvas itself is not selected when an element is clicked
    setIsSelected(false);

    // Notify parent that an element is selected
    if (onSelectElement) {
      onSelectElement(type);
    }
  };

  // Get background style based on whether it's a gradient or solid color
  const getBackgroundStyle = (): React.CSSProperties => {
    if (gradient) {
      // If it's a gradient, use the appropriate CSS
      if (gradient.type === "linear") {
        return {
          background: `linear-gradient(${gradient.angle || "90deg"}, ${gradient.colors.join(
            ", "
          )})`,
        };
      } else if (gradient.type === "circular" || gradient.type === "radial") {
        return {
          background: `radial-gradient(circle at ${
            gradient.position || "center"
          }, ${gradient.colors.join(", ")})`,
        };
      }
    }

    // Default to solid color
    return { backgroundColor: color };
  };

  // Build class name based on state
  const canvasClassName = `canvas-container ${isSelected ? "selected" : ""} ${
    isHovering ? "hover" : ""
  }`;

  return (
    <div
      ref={canvasRef}
      className={canvasClassName}
      onClick={handleCanvasClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", ...getBackgroundStyle() }}
    >
      {elements && elements.length > 0 ? (
        elements.map((element, index) => (
          <CanvasElement
            key={`${id}-element-${index}`}
            type={element.type}
            style={element.style}
            onClick={e => handleElementClick(e, element.type, index)}
            isSelected={selectedElementId === index}
          />
        ))
      ) : (
        <div className="canvas-content">{/* Empty canvas */}</div>
      )}
    </div>
  );
};

export default Canvas;
