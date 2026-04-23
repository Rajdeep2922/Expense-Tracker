// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { useNetworkQueue } from './hooks/useNetworkQueue';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Expenses from './pages/expenses/Expenses';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading fullScreen />;
  if (user) return <Navigate to="/" replace />;
  return children;
};

// Start the network queue within the providers
const QueueManager = ({ children }) => {
  useNetworkQueue();
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <AuthProvider>
        <ExpenseProvider>
          <QueueManager>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </QueueManager>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
