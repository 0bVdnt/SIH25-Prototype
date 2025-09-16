// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AzureMapsProvider } from 'react-azure-maps';
import { theme } from './theme';

// Import all pages and layouts
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Define the application's routes
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute allowedRoles={['citizen', 'admin']}>
            <CitizenDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      // Redirect from the root path to the citizen dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },
    ],
  },
  // Add a catch-all for not found pages if needed
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AzureMapsProvider>
        <RouterProvider router={router} />
      </AzureMapsProvider>
    </ThemeProvider>
  );
}

export default App;