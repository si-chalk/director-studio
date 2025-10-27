import React from "react";
import ToolbarButton from "../ToolbarButton";
import "./style.css";

import ButtonComment from "@assets/icons/toolbars/canvas-toolbar/button-comment.svg";
import ButtonFill from "@assets/icons/toolbars/canvas-toolbar/button-fill.svg";
import ButtonDuration from "@assets/icons/toolbars/canvas-toolbar/button-duration.svg";
import ButtonPosition from "@assets/icons/toolbars/canvas-toolbar/button-position.svg";
import ButtonCopyStyle from "@assets/icons/toolbars/canvas-toolbar/button-copystyle.svg";

const CanvasToolbar: React.FC = () => {
  return (
    <div className="toolbar canvas-toolbar" style={{ gap: "4px" }}>
      <ToolbarButton
        icon={<img src={ButtonComment} alt="Comment" />}
        label="Comment"
        onClick={() => {
          /* Comment functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonFill} alt="Fill" />}
        label="Fill"
        onClick={() => {
          /* Fill functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={ButtonDuration} alt="Duration" />
          </div>
        }
        label="Duration"
        onClick={() => {
          /* Duration functionality placeholder */
        }}
        width={76}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonPosition} alt="Position" />}
        label="Position"
        onClick={() => {
          /* Position functionality placeholder */
        }}
        width={80}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonCopyStyle} alt="Copy Style" />}
        label="Copy Style"
        onClick={() => {
          /* Copy style functionality placeholder */
        }}
      />
    </div>
  );
};

export default CanvasToolbar;
