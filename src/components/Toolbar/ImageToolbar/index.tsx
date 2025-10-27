import React from "react";
import ToolbarButton from "../ToolbarButton";
import "./style.css";

import ButtonEdit from "@assets/icons/toolbars/image-toolbar/button-edit.svg";
import ButtonBgRemover from "@assets/icons/toolbars/image-toolbar/button-bgremover.svg";
import ButtonFill from "@assets/icons/toolbars/image-toolbar/button-fill.svg";
import ButtonBorder from "@assets/icons/toolbars/image-toolbar/button-border.svg";
import ButtonRounding from "@assets/icons/toolbars/image-toolbar/button-rounding.svg";
import ButtonCrop from "@assets/icons/toolbars/image-toolbar/button-crop.svg";
import ButtonFlip from "@assets/icons/toolbars/image-toolbar/button-flip.svg";
import ButtonTransparency from "@assets/icons/toolbars/image-toolbar/button-transparency.svg";
import ButtonAnimate from "@assets/icons/toolbars/image-toolbar/button-animate.svg";
import ButtonPosition from "@assets/icons/toolbars/image-toolbar/button-position.svg";
import ButtonCopyStyle from "@assets/icons/toolbars/image-toolbar/button-copystyle.svg";

const ImageToolbar: React.FC = () => {
  return (
    <div className="toolbar image-toolbar">
      <ToolbarButton
        icon={<img src={ButtonEdit} alt="Edit" />}
        label="Edit"
        onClick={() => {
          /* Edit functionality placeholder */
        }}
        width={76}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonBgRemover} alt="BG Remover" />}
        label="BG Remover"
        onClick={() => {
          /* Background remover functionality placeholder */
        }}
        width={131}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonFill} alt="Fill" />}
        label="Fill"
        onClick={() => {
          /* Fill functionality placeholder */
        }}
      />

      <ToolbarButton
        icon={<img src={ButtonBorder} alt="Stroke" />}
        label="Stroke"
        onClick={() => {
          /* Stroke functionality placeholder */
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
      <ToolbarButton
        icon={<img src={ButtonTransparency} alt="Transparency" />}
        label="Transparency"
        onClick={() => {
          /* Transparency functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>

      <ToolbarButton
        icon={<img src={ButtonAnimate} alt="Animate" />}
        label="Animate"
        onClick={() => {
          /* Animate functionality placeholder */
        }}
        width={101}
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

export default ImageToolbar;
