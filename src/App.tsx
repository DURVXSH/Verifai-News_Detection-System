import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ArticleAnalysisPage } from './pages/ArticleAnalysisPage';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="verifai-theme">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/article-analysis" element={<ArticleAnalysisPage />} />
        {/* Redirect /home-page to / */}
        <Route path="/home-page" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;