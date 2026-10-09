import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { PlanPage } from './pages/PlanPage';
import { PlanResultsPage } from './pages/PlanResultsPage';
import { NavigationPage } from './pages/NavigationPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { RestrictionsPage } from './pages/RestrictionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { TripsPage } from './pages/TripsPage';
import { CoveragePage } from './pages/CoveragePage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0B1B32] text-[#F8FAFC] flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/plan/:id" element={<PlanResultsPage />} />
                <Route path="/navigate/:id" element={<NavigationPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/restrictions" element={<RestrictionsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/coverage" element={<CoveragePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <AuthModal />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
