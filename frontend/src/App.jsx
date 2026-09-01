import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeDashboard from './pages/HomeDashboard';
import GisRiskMap from './pages/GisRiskMap';
import CitizenReport from './pages/CitizenReport';
import AlertsFeed from './pages/AlertsFeed';
import AuthorityDashboard from './pages/AuthorityDashboard';
import RiskScoring from './pages/RiskScoring';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(3);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-background text-on-background antialiased selection:bg-secondary-fixed selection:text-primary">
          <Navbar
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            unreadAlertsCount={unreadAlertsCount}
          />

          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomeDashboard currentLang={currentLang} />} />
              <Route path="/map" element={<GisRiskMap />} />
              <Route path="/report" element={<CitizenReport />} />
              <Route path="/alerts" element={<AlertsFeed currentLang={currentLang} onLanguageChange={handleLanguageChange} />} />
              <Route
                path="/authority"
                element={
                  <ProtectedRoute role="authority">
                    <AuthorityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/risk-scoring" element={<RiskScoring />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
          <AuthModal />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
