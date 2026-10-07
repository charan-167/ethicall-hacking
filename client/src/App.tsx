import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DemoModeModal } from './components/DemoModeModal';

import { LandingPage } from './pages/LandingPage';
import { FirstAccessPortalPage } from './pages/FirstAccessPortalPage';
import { AuthResultPage } from './pages/AuthResultPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ConnectedDevicesPage } from './pages/ConnectedDevicesPage';
import { AuthLogsPage } from './pages/AuthLogsPage';
import { NetworkSecurityPage } from './pages/NetworkSecurityPage';
import { NetworkTopologyPage } from './pages/NetworkTopologyPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { SecurityWorkflowPage } from './pages/SecurityWorkflowPage';
import { EventSimulatorPage } from './pages/EventSimulatorPage';
import { PresentationModePage } from './pages/PresentationModePage';

const AppContent: React.FC = () => {
  const location = useLocation();

  // Show sidebar on dashboard/admin/management routes
  const isDashboardRoute = [
    '/admin-dashboard',
    '/devices',
    '/logs',
    '/security-events',
    '/topology',
    '/security-settings',
    '/reports',
    '/simulator',
    '/presentation',
    '/settings',
  ].some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e17] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <div className="flex flex-1">
        {isDashboardRoute && <Sidebar />}

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/first-access" element={<FirstAccessPortalPage />} />
            <Route path="/auth-result" element={<AuthResultPage />} />
            <Route path="/user-dashboard" element={<UserDashboardPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/devices" element={<ConnectedDevicesPage />} />
            <Route path="/logs" element={<AuthLogsPage />} />
            <Route path="/security-events" element={<AuthLogsPage />} />
            <Route path="/security-settings" element={<NetworkSecurityPage />} />
            <Route path="/topology" element={<NetworkTopologyPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutProjectPage />} />
            <Route path="/workflow" element={<SecurityWorkflowPage />} />
            <Route path="/simulator" element={<EventSimulatorPage />} />
            <Route path="/presentation" element={<PresentationModePage />} />
          </Routes>
        </main>
      </div>

      <Footer />
      <DemoModeModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
