import React from "react";
import ToolbarButton from "../ToolbarButton";
import "./style.css";

// Import all SVG icons
import ButtonEdit from "@assets/icons/toolbars/image-toolbar/button-edit.svg";
import ButtonVideoTrim from "@assets/icons/toolbars/video-toolbar/button-videotrim.svg";
import ButtonBgRemover from "@assets/icons/toolbars/video-toolbar/button-bgremover.svg";
import ButtonSpeed from "@assets/icons/toolbars/video-toolbar/button-speed.svg";
import ButtonPlayback from "@assets/icons/toolbars/video-toolbar/button-playback.svg";
import ButtonBorder from "@assets/icons/toolbars/video-toolbar/button-border.svg";
import ButtonRounding from "@assets/icons/toolbars/video-toolbar/button-rounding.svg";
import ButtonCrop from "@assets/icons/toolbars/video-toolbar/button-crop.svg";
import ButtonFlip from "@assets/icons/toolbars/video-toolbar/button-flip.svg";
import ButtonTransparency from "@assets/icons/toolbars/video-toolbar/button-transparency.svg";
import ButtonAnimate from "@assets/icons/toolbars/video-toolbar/button-animate.svg";
import ButtonPosition from "@assets/icons/toolbars/video-toolbar/button-position.svg";
import ButtonCopyStyle from "@assets/icons/toolbars/video-toolbar/button-copystyle.svg";

const VideoToolbar: React.FC = () => {
  return (
    <div className="toolbar video-toolbar" style={{ gap: "4px" }}>
      {/* Video editing options */}
      <ToolbarButton
        icon={<img src={ButtonEdit} alt="Edit" />}
        label="Edit"
        onClick={() => {
          /* Edit functionality placeholder */
        }}
        width={76}
      />

      <div className="toolbar-divider"></div>

      {/* Video playback controls */}
      <ToolbarButton
        icon={<img src={ButtonVideoTrim} alt="Video Trim" />}
        label="Video Trim"
        onClick={() => {
          /* Video trim functionality placeholder */
        }}
        width={100}
      />

      <ToolbarButton
        icon={<img src={ButtonBgRemover} alt="BG Remover" />}
        label="BG Remover"
        onClick={() => {
          /* Background remover functionality placeholder */
        }}
        width={131}
      />

      <ToolbarButton
        icon={<img src={ButtonSpeed} alt="Speed" />}
        label="Speed"
        onClick={() => {
          /* Speed functionality placeholder */
        }}
      />

      <ToolbarButton
        icon={<img src={ButtonPlayback} alt="Playback" />}
        label="Playback"
        onClick={() => {
          /* Playback functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>

      {/* Line Rounding editing options */}
      <ToolbarButton
        icon={<img src={ButtonBorder} alt="Border" />}
        label="Border"
        onClick={() => {
          /* Border functionality placeholder */
        }}
      />

      <ToolbarButton
        icon={<img src={ButtonRounding} alt="Rounding" />}
        label="Rounding"
        onClick={() => {
          /* Rounding functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>

      {/* Crop Flip editing options */}
      <ToolbarButton
        icon={<img src={ButtonCrop} alt="Crop" />}
        label="Crop"
        onClick={() => {
          /* Crop functionality placeholder */
        }}
      />

      <ToolbarButton
        icon={<img src={ButtonFlip} alt="Flip" />}
        label="Flip"
        onClick={() => {
          /* Flip functionality placeholder */
        }}
        width={50}
      />

      <div className="toolbar-divider"></div>

      {/* Transparency editing options */}
      <ToolbarButton
        icon={<img src={ButtonTransparency} alt="Transparency" />}
        label="Transparency"
        onClick={() => {
          /* Transparency functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>

      {/* Animate editing options */}
      <ToolbarButton
        icon={<img src={ButtonAnimate} alt="Animate" />}
        label="Animate"
        onClick={() => {
          /* Animate functionality placeholder */
        }}
        width={105}
      />

      <div className="toolbar-divider"></div>

      {/* Position editing options */}
      <ToolbarButton
        icon={<img src={ButtonPosition} alt="Position" />}
        label="Position"
        onClick={() => {
          /* Position functionality placeholder */
        }}
        width={80}
      />

      <div className="toolbar-divider"></div>

      {/* Copy and paste style */}
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

export default VideoToolbar;
