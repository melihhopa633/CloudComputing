import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin and user is not admin, redirect to tasks
  if (requireAdmin && !authService.isAdmin()) {
    return <Navigate to="/tasks" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute; 