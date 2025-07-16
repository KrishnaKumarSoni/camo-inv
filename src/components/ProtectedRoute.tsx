// Protected Route component for authentication
// PRD: access_control: "Only allow access to authenticated users, no role restrictions for MVP"

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  // PRD: Only allow access to authenticated users
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}