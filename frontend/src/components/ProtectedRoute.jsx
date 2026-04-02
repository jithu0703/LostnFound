import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to landing page with login trigger
    return <Navigate to="/?login=true" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
