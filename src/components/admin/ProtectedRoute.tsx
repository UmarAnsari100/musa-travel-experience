import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AuthContext';
import { AdminRole } from '@/types/booking';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AdminRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, role } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            Authenticating MUSA Transport Secure Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F8F5EC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111111] border border-[rgba(74,57,28,0.25)] p-8 rounded-2xl text-center">
          <div className="w-12 h-12 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h2 className="font-display text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-sm text-[#B8B2A3] mb-6">
            Your role (<span className="text-[#D4AF37] font-semibold">{role}</span>) does not have sufficient clearance to access this module.
          </p>
          <a
            href="/admin"
            className="inline-block px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider rounded-lg"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
