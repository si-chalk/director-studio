import React from "react";
import Header from "../../Header/Header";
import SideNavContainer from "../../SideNav/SideNavContainer";
import Footer from "../../Footer/Footer";
import "./style.css";

interface NavigationContainerProps {
  children: React.ReactNode;
  onMenuToggle?: () => void;
  isWebsiteView?: boolean;
  websiteButton?: React.ReactNode;
  isPrintView?: boolean;
  printButton?: React.ReactNode;
  showCanvaAI?: boolean;
  isCanvaAIView?: boolean;
  enableFooterAskCanva?: boolean; // Controls whether footer Ask Canva functionality is available
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
  onMenuToggle,
  isWebsiteView,
  websiteButton,
  isPrintView,
  printButton,
  showCanvaAI,
  isCanvaAIView,
  enableFooterAskCanva = false,
}) => {
  return (
    <>
      <Header
        onMenuToggle={onMenuToggle}
        isWebsiteView={isWebsiteView}
        websiteButton={websiteButton}
        isPrintView={isPrintView}
        printButton={printButton}
        isCanvaAIView={isCanvaAIView}
      />
      <SideNavContainer showCanvaAI={showCanvaAI} />
      {children}
      <Footer enableAskCanva={enableFooterAskCanva} />
    </>
  );
};

export default NavigationContainer;
