import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Dynamic basename calculation based on current URL
function getBasename(): string {
  const { host, pathname } = window.location;

  // If index.html is in the path, remove it so / works correctly
  if (pathname.endsWith("/index.html")) {
    window.history.replaceState({}, "", pathname.slice(0, -10));
  }

  // Check if environment variable is set first
  const envBasePath = import.meta.env.VITE_BASE_PATH;
  if (envBasePath) {
    return envBasePath;
  }

  // If the host is flyingfox.canva-experiments.com, then the basename should be window.location.pathname without the /index.html
  if (host === "flyingfox.canva-experiments.com") {
    return pathname.replace("/index.html", "");
  }

  // Default to root
  return "/";
}

const basename = getBasename();

console.info("basename", basename);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
