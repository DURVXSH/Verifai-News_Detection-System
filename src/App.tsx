import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './components/AuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ArticleAnalysisPage } from './pages/ArticleAnalysisPage';
import { NewsPage } from './pages/NewsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { SocialPage } from './pages/SocialPage';
import { SideChatbot } from './components/SideChatbot';
import { LandingPage } from './pages/LandingPage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="verifai-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <AboutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/media-analysis"
            element={
              <PrivateRoute>
                <ArticleAnalysisPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/news"
            element={
              <PrivateRoute>
                <NewsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/social"
            element={
              <PrivateRoute>
                <SocialPage />
              </PrivateRoute>
            }
          />
          <Route path="/home-page" element={<Navigate to="/dashboard" replace />} />
          <Route path="/article-analysis" element={<Navigate to="/media-analysis" replace />} />
        </Routes>
        <SideChatbot />
        <Analytics />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;