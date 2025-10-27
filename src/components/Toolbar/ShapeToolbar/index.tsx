import React from "react";
import ToolbarButton from "../ToolbarButton";
import "./style.css";

// Import all SVG icons
import ButtonShape from "@assets/icons/toolbars/shape-toolbar/button-shape.svg";
import ButtonFill from "@assets/icons/toolbars/shape-toolbar/button-fill.svg";
import ButtonBorder from "@assets/icons/toolbars/shape-toolbar/button-border.svg";
import ButtonRounding from "@assets/icons/toolbars/shape-toolbar/button-rounding.svg";
import ButtonFontFamily from "@assets/icons/toolbars/shape-toolbar/button-fontfamily.svg";
import ButtonFontSize from "@assets/icons/toolbars/shape-toolbar/button-fontsize.svg";
import ButtonTextColor from "@assets/icons/toolbars/shape-toolbar/button-textcolor.svg";
import ButtonFontFormatBold from "@assets/icons/toolbars/shape-toolbar/button-fontformat-bold.svg";
import ButtonFontFormatItalics from "@assets/icons/toolbars/shape-toolbar/button-fontformat-italics.svg";
import ButtonFontFormatUnderline from "@assets/icons/toolbars/shape-toolbar/button-fontformat-underline.svg";
import ButtonFontFormatStrikethrough from "@assets/icons/toolbars/shape-toolbar/button-fontformat-strikethrough.svg";
import ButtonFontFormatAlignment from "@assets/icons/toolbars/shape-toolbar/button-fontformat-alignment.svg";
import ButtonFontFormatList from "@assets/icons/toolbars/shape-toolbar/button-fontformat-list.svg";
import ButtonFontFormatSpacing from "@assets/icons/toolbars/shape-toolbar/button-fontformat-spacing.svg";
import ButtonFontFormatUppercase from "@assets/icons/toolbars/shape-toolbar/button-fontformat-uppercase.svg";
import ButtonFontFormatAdvanced from "@assets/icons/toolbars/shape-toolbar/button-fontformat-advanced.svg";
import ButtonTransparency from "@assets/icons/toolbars/shape-toolbar/button-transparency.svg";
import ButtonAnimate from "@assets/icons/toolbars/shape-toolbar/button-animate.svg";
import ButtonPosition from "@assets/icons/toolbars/shape-toolbar/button-position.svg";
import ButtonCopyStyle from "@assets/icons/toolbars/shape-toolbar/button-copystyle.svg";

const ShapeToolbar: React.FC = () => {
  return (
    <div className="toolbar shape-toolbar" style={{ gap: "4px" }}>
      <ToolbarButton
        icon={<img src={ButtonShape} alt="Shape" />}
        label="Shape"
        onClick={() => {
          /* Shape functionality placeholder */
        }}
        width={76}
      />

      <div className="toolbar-divider"></div>

      {/* Color and Style Section */}
      <ToolbarButton
        icon={<img src={ButtonFill} alt="Fill" />}
        label="Fill"
        onClick={() => {
          /* Fill functionality placeholder */
        }}
      />

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

      {/* Font Section */}
      <ToolbarButton
        icon={<img src={ButtonFontFamily} alt="Font Family" />}
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
        icon={<img src={ButtonTextColor} alt="Text Color" />}
        label="Text Color"
        onClick={() => {
          /* Text color functionality placeholder */
        }}
      />

      {/* Text Formatting Section */}
      <ToolbarButton
        icon={<img src={ButtonFontFormatBold} alt="Bold" />}
        label="Bold"
        onClick={() => {
          /* Bold functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatItalics} alt="Italic" />}
        label="Italic"
        onClick={() => {
          /* Italic functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatUnderline} alt="Underline" />}
        label="Underline"
        onClick={() => {
          /* Underline functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatStrikethrough} alt="Strikethrough" />}
        label="Strikethrough"
        onClick={() => {
          /* Strikethrough functionality placeholder */
        }}
        width={40}
      />

      <div className="toolbar-divider"></div>

      {/* Text Alignment and Formatting */}
      <ToolbarButton
        icon={<img src={ButtonFontFormatAlignment} alt="Alignment" />}
        label="Alignment"
        onClick={() => {
          /* Alignment functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatList} alt="List" />}
        label="List"
        onClick={() => {
          /* List functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatSpacing} alt="Spacing" />}
        label="Spacing"
        onClick={() => {
          /* Spacing functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatUppercase} alt="Uppercase" />}
        label="Uppercase"
        onClick={() => {
          /* Uppercase functionality placeholder */
        }}
        width={40}
      />

      <ToolbarButton
        icon={<img src={ButtonFontFormatAdvanced} alt="Advanced" />}
        label="Advanced"
        onClick={() => {
          /* Advanced functionality placeholder */
        }}
        width={40}
      />

      <div className="toolbar-divider"></div>

      {/* Effects and Position */}
      <ToolbarButton
        icon={<img src={ButtonTransparency} alt="Transparency" />}
        label="Transparency"
        onClick={() => {
          /* Transparency functionality placeholder */
        }}
      />

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
        icon={<img src={ButtonCopyStyle} alt="Copy Style" />}
        label="Copy Style"
        onClick={() => {
          /* Copy style functionality placeholder */
        }}
      />
    </div>
  );
};

export default ShapeToolbar;
