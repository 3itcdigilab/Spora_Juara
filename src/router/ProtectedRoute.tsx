import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  const { isAuthenticated, role, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/403" replace />;

  // Industry & School require active verified status from Admin
  if ((role === 'school' || role === 'industry') && user?.status === 'pending') {
    return <Navigate to="/pending-verification" replace />;
  }

  return <Outlet />;
};