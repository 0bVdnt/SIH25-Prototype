import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ReportsPage from './pages/ReportsPage';
import SubmitReportPage from './pages/SubmitReportPage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
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
              <ReportsPage />
            </Layout>
          } />
          
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          
          <Route path="/events" element={
            <Layout>
              <EventsPage />
            </Layout>
          } />
          
          {/* Protected citizen routes */}
          <Route path="/submit-report" element={
            <ProtectedRoute requiredRole="citizen">
              <Layout>
                <SubmitReportPage />
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
      </Router>
    </AuthProvider>
  );
}

export default App;