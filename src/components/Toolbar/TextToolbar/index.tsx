import React from "react";
import ToolbarButton from "../ToolbarButton";
import "./style.css";

import ButtonFontFamily from "@assets/icons/toolbars/text-toolbar/button-fontfamily.svg";
import ButtonFontSize from "@assets/icons/toolbars/text-toolbar/button-fontsize.svg";
import ButtonTextColor from "@assets/icons/toolbars/text-toolbar/button-textcolor.svg";
import ButtonFontFormatBold from "@assets/icons/toolbars/text-toolbar/button-fontformat-bold.svg";
import ButtonFontFormatItalics from "@assets/icons/toolbars/text-toolbar/button-fontformat-italics.svg";
import ButtonFontFormatUnderline from "@assets/icons/toolbars/text-toolbar/button-fontformat-underline.svg";
import ButtonFontFormatStrikethrough from "@assets/icons/toolbars/text-toolbar/button-fontformat-strikethrough.svg";
import ButtonFontFormatAlignment from "@assets/icons/toolbars/text-toolbar/button-fontformat-alignment.svg";
import ButtonFontFormatList from "@assets/icons/toolbars/text-toolbar/button-fontformat-list.svg";
import ButtonFontFormatSpacing from "@assets/icons/toolbars/text-toolbar/button-fontformat-spacing.svg";
import ButtonFontFormatUppercase from "@assets/icons/toolbars/text-toolbar/button-fontformat-uppercase.svg";
import ButtonFontFormatAdvanced from "@assets/icons/toolbars/text-toolbar/button-fontformat-advanced.svg";
import ButtonTransparency from "@assets/icons/toolbars/text-toolbar/button-transparency.svg";
import ButtonAnimate from "@assets/icons/toolbars/text-toolbar/button-animate.svg";
import ButtonPosition from "@assets/icons/toolbars/text-toolbar/button-position.svg";
import ButtonCopyStyle from "@assets/icons/toolbars/text-toolbar/button-copystyle.svg";


const TextToolbar: React.FC = () => {
  return (
    <div className="toolbar text-toolbar" style={{ gap: "4px" }}>
      {/* Font options */}
      <ToolbarButton
        icon={
          <img src={ButtonFontFamily} alt="Font Family" />
        }
        label="Font Family"
        onClick={() => {
          /* Font family functionality placeholder */
        }}
        width={136}
      />

      <ToolbarButton
        icon={<img src={ButtonFontSize} alt="Font Size" />}
        label="Font Size"
        onClick={() => {
          /* Font size functionality placeholder */
        }}
        width={104}
      />

      <ToolbarButton
        icon={
          <img src={ButtonTextColor} alt="Text Color" />
        }
        label="Text Color"
        onClick={() => {
          /* Text color functionality placeholder */
        }}
      />

      {/* Text formatting */}
      <ToolbarButton
        icon={
          <img src={ButtonFontFormatBold} alt="Bold" />
        }
        label="Bold"
        onClick={() => {
          /* Bold functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatItalics}
            alt="Italic"
          />
        }
        label="Italic"
        onClick={() => {
          /* Italic functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatUnderline}
            alt="Underline"
          />
        }
        label="Underline"
        onClick={() => {
          /* Underline functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatStrikethrough}
            alt="Strikethrough"
          />
        }
        label="Strikethrough"
        onClick={() => {
          /* Strikethrough functionality placeholder */
        }}
        width={40}
      />

      {/* Text alignment and formatting */}
      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatAlignment}
            alt="Alignment"
          />
        }
        label="Alignment"
        onClick={() => {
          /* Alignment functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img src={ButtonFontFormatList} alt="List" />
        }
        label="List"
        onClick={() => {
          /* List functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatSpacing}
            alt="Spacing"
          />
        }
        label="Spacing"
        onClick={() => {
          /* Spacing functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatUppercase}
            alt="Uppercase"
          />
        }
        label="Uppercase"
        onClick={() => {
          /* Uppercase functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={
          <img
            src={ButtonFontFormatAdvanced}
            alt="Advanced"
          />
        }
        label="Advanced"
        onClick={() => {
          /* Advanced functionality placeholder */
        }}
        width={40}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={
          <img
            src={ButtonTransparency}
            alt="Transparency"
          />
        }
        label="Transparency"
        onClick={() => {
          /* Transparency functionality placeholder */
        }}
      />

      <div className="toolbar-divider"></div>
      {/* Effects and position */}
      <ToolbarButton
        icon={<img src={ButtonFontFormatAdvanced} alt="Effects" />}
        label="Effects"
        onClick={() => {
          /* Effects functionality placeholder */
        }}
        // width={64}
      />

      <div className="toolbar-divider"></div>
      <ToolbarButton
        icon={<img src={ButtonAnimate} alt="Animate" />}
        label="Animate"
        onClick={() => {
          /* Animate functionality placeholder */
        }}
        width={105}
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
        icon={
          <img src={ButtonCopyStyle} alt="Copy Style" />
        }
        label="Copy Style"
        onClick={() => {
          /* Copy style functionality placeholder */
        }}
      />
    </div>
  );
};

export default TextToolbar;
