import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { setupAuth } from '@canva-ct/genai';
import './fonts.css';



import AIPresentationView from '@/components/Views/PresentationAI';
import StoryboardGenerator from '@/components/Views/StoryboardGenerator';

// Import all CSS files
import './styles/variables.css';
import './styles/base-page.css';
import './App.css';

const App: React.FC = () => {
  // Initialize GenAI authentication
  useEffect(() => {
    setupAuth();
  }, []);

  return (
    <>
      <Routes>

        {/* AI routes */}
        <Route path="/storyboard-generator" element={<StoryboardGenerator />} />
        <Route path="/ai-presentation" element={<AIPresentationView />} />
        <Route path="/" element={<StoryboardGenerator />} />
      </Routes>
    </>
  );
};

export default App;
