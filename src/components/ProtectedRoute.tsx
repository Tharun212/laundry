
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { WashingMachine } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useSupabaseAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <WashingMachine className="h-16 w-16 text-indigo-600 mx-auto animate-spin" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
