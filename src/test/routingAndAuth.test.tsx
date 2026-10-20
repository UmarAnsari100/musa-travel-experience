import "@/i18n";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import Fleet from '@/pages/Fleet';
import ConfirmBooking from '@/pages/ConfirmBooking';
import NotFound from '@/pages/NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { BookingProvider } from '@/context/BookingContext';

const createTestApp = (initialEntry: string) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/confirm" element={<ConfirmBooking />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MemoryRouter>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('MUSA TRANSPORT Routing & Admin Access', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders AdminLogin page directly when navigating to /admin/login', async () => {
    render(createTestApp('/admin/login'));

    await waitFor(() => {
      expect(screen.getByText(/operations portal/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/admin@musatransport\.com/i)).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated users from /admin to /admin/login', async () => {
    render(createTestApp('/admin'));

    await waitFor(() => {
      // Unauthenticated access must redirect to login
      expect(screen.getByText(/operations portal/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/admin@musatransport\.com/i)).toBeInTheDocument();
    });
  });

  it('renders AdminDashboard when authenticated administrator navigates to /admin directly or on refresh', async () => {
    // Seed authenticated session in localStorage (as AuthContext restores)
    const adminSession = {
      id: 'usr-admin-1',
      email: 'admin@musatransport.com',
      name: 'Operations Director',
      role: 'super_admin',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('musa_transport_auth_session', JSON.stringify(adminSession));

    render(createTestApp('/admin'));

    await waitFor(() => {
      expect(screen.getByText(/today's pickups/i)).toBeInTheDocument();
      expect(screen.getByText(/bookings \(/i)).toBeInTheDocument();
    });
  });

  it('renders Fleet page when navigating to /fleet', async () => {
    render(createTestApp('/fleet'));

    await waitFor(() => {
      expect(screen.getAllByText("Toyota Camry").length).toBeGreaterThan(0);
    });
  });

  it('renders ConfirmBooking page when navigating to /confirm', async () => {
    render(createTestApp('/confirm'));

    await waitFor(() => {
      expect(screen.getByText(/driver confirmation/i)).toBeInTheDocument();
    });
  });

  it('renders NotFound page for non-existent paths', async () => {
    render(createTestApp('/non-existent-route'));

    await waitFor(() => {
      expect(screen.getByText(/404/i)).toBeInTheDocument();
      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });
  });
});
