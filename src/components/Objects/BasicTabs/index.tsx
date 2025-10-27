import React from "react";
import "./style.css";

export interface TabItem {
  id: string;
  name: string;
}

interface BasicTabsProps {
  tabs: TabItem[];
  activeTab?: number;
  onTabChange?: (tabIndex: number, tab: TabItem) => void;
  className?: string;
}

const BasicTabs: React.FC<BasicTabsProps> = ({
  tabs,
  activeTab = 0,
  onTabChange,
  className = "",
}) => {
  const handleTabClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index, tabs[index]);
    }
  };

  return (
    <div className={`basic-tabs-container ${className}`}>
      <div className="basic-tabs-pills">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`basic-tab-pill ${activeTab === index ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
            aria-label={tab.name}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div
        className="basic-tabs-indicator"
        style={{
          left: `${(activeTab / tabs.length) * 100}%`,
          width: `${(1 / tabs.length) * 100}%`,
        }}
      />
    </div>
  );
};

export default BasicTabs;
