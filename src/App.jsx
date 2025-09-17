import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Import toast CSS
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ModernReportsPage from './pages/ModernReportsPage';
import ModernSubmitReportPage from './pages/ModernSubmitReportPage';
import AboutPage from './pages/AboutPage';
import GamificationPage from './pages/GamificationPage';
import AdminDashboard from './pages/AdminDashboard';
import MapPage from './pages/MapPage';

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Routes with layout */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              
              <Route path="/reports" element={
                <Layout>
                  <ModernReportsPage />
                </Layout>
              } />
              
              <Route path="/map" element={
                <Layout>
                  <MapPage />
                </Layout>
              } />
              
              <Route path="/about" element={
                <Layout>
                  <AboutPage />
                </Layout>
              } />
              
              {/* Protected citizen routes */}
              <Route path="/submit-report" element={
                <ProtectedRoute requiredRole="citizen">
                  <Layout>
                    <ModernSubmitReportPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/gamification" element={
                <ProtectedRoute requiredRole="citizen">
                  <Layout>
                    <GamificationPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="!text-sm"
              bodyClassName="!text-sm"
            />
          </Router>
        </NotificationProvider>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;