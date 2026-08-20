import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  const { isAuthenticated, role, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Admin role has super-access to inspect, otherwise role must match allowedRole
  if (allowedRole && role !== allowedRole && role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  // Industry & School require active verified status from Admin
  if ((role === 'school' || role === 'industry') && user?.status === 'pending') {
    return <Navigate to="/pending-verification" replace />;
  }

  return <Outlet />;
};