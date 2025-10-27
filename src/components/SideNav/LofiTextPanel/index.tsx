import React from "react";
import "./style.css";

// IMAGE IMPORTS
import LofiTextDropdownPill from "./assets/dropdown-pill.svg?react";
import LofiTextBrandKitIcon from "./assets/icon-brand-kit.svg?react";
import LofiTextMagicWriteIcon from "./assets/icon-magic-write.svg?react";

// BASIC SEARCHBAR IMPORTS
import BasicSearchbar from "@components/Objects/BasicSearchbar";

interface TextStyle {
  id: number;
  name: string;
  className: string;
}

interface FontCombination {
  id: number;
  name: string;
  heading: string;
  body: string;
}

/**
 * Text panel component that displays text styles and font combinations
 */
const LofiTextPanel: React.FC = () => {
  // Sample data for text styles
  const textStyles: TextStyle[] = [
    {
      id: 1,
      name: "Heading",
      className: "text-heading",
    },
    {
      id: 2,
      name: "Sub heading",
      className: "text-subheading",
    },
    {
      id: 3,
      name: "Body text",
      className: "text-body",
    },
  ];

  // Sample data for font combinations
  const fontCombinations: FontCombination[] = [
    {
      id: 1,
      name: "Modern Sans",
      heading: "Montserrat",
      body: "Open Sans",
    },
    {
      id: 2,
      name: "Classic Serif",
      heading: "Playfair Display",
      body: "Georgia",
    },
    {
      id: 3,
      name: "Clean Minimal",
      heading: "Helvetica Neue",
      body: "Arial",
    },
    {
      id: 4,
      name: "Creative Mix",
      heading: "Poppins",
      body: "Roboto",
    },
    {
      id: 5,
      name: "Elegant Serif",
      heading: "Merriweather",
      body: "Lato",
    },
    {
      id: 6,
      name: "Technical Sans",
      heading: "Roboto Mono",
      body: "Source Sans Pro",
    },
    {
      id: 7,
      name: "Playful Mix",
      heading: "Quicksand",
      body: "Nunito",
    },
    {
      id: 8,
      name: "Bold Statement",
      heading: "Oswald",
      body: "Raleway",
    },
  ];

  return (
    <div className="lofi-text-panel">
      {/* Sticky Header */}
      <div className="lofi-text-sticky-header">
        {/* Search Bar */}
        <div className="lofi-search-container text-panel-search-container">
          <BasicSearchbar sampleText="Search fonts and combinations" />
        </div>

        {/* Add Text Button */}
        <div className="lofi-add-text-container">
          <button className="lofi-add-text-button">Add a text box</button>
        </div>

        {/* Magic Write Button */}
        <div className="lofi-magic-write-container">
          <div className="lofi-magic-write-image-container">
            <LofiTextMagicWriteIcon />
          </div>
          <div className="lofi-magic-write-text-container">
            <button className="lofi-magic-write-button">Magic Write</button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="lofi-text-scrollable-content">
        {/* Brand Kit Section */}
        <div className="lofi-brand-kit-container">
          <div className="lofi-brand-kit-header">
            <div className="lofi-brand-kit-title">
              <LofiTextBrandKitIcon />
              Brand Kit
            </div>
            <button className="lofi-edit-button">Edit</button>
          </div>
          <div className="lofi-brand-kit-progress">
            <LofiTextDropdownPill />
          </div>
        </div>

        {/* Text Styles Section */}
        <div className="lofi-section-container">
          <div className="lofi-section-header">
            <h3>Default text styles</h3>
            <button className="lofi-see-all-button">See all</button>
          </div>
          <div className="lofi-text-styles-container">
            {textStyles.map(style => (
              <div key={style.id} className="lofi-text-style-item">
                <div className={style.className}>{style.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Combinations Section */}
        <div className="lofi-section-container">
          <div className="lofi-section-header">
            <h3>Font combinations</h3>
            <button className="lofi-see-all-button">See all</button>
          </div>
          <div className="lofi-font-combos-grid">
            {fontCombinations.slice(0, 8).map(combo => (
              <div key={combo.id} className="lofi-font-combo-item">
                {/* <div style={{ fontFamily: combo.heading }}>{combo.name}</div>
                <div style={{ fontFamily: combo.body }}>Aa</div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LofiTextPanel;
