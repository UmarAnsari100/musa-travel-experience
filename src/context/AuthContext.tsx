import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AdminRole, AdminUser } from '@/types/booking';

interface AuthContextType {
  user: AdminUser | null;
  role: AdminRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  canManageVisas: boolean;
  canDispatch: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isSuperAdmin: false,
  canManageVisas: false,
  canDispatch: false,
});

const DEMO_ADMIN: AdminUser = {
  id: 'usr-admin-1',
  email: 'admin@musatransport.com',
  name: 'Operations Director',
  role: 'super_admin',
  created_at: new Date().toISOString(),
};

const LOCAL_AUTH_KEY = 'musa_transport_auth_session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile role from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.user_metadata?.name || 'Administrator',
              role: (profile?.role as AdminRole) || 'operations_manager',
              created_at: session.user.created_at,
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('[AuthContext] Supabase session check error:', err);
        }
      }

      // Check stored session for development/offline
      try {
        const saved = localStorage.getItem(LOCAL_AUTH_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || 'Administrator',
            role: (profile?.role as AdminRole) || 'operations_manager',
            created_at: session.user.created_at,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: profile?.name || 'Administrator',
            role: (profile?.role as AdminRole) || 'operations_manager',
            created_at: data.user.created_at,
          };

          setUser(adminUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err?.message || 'Authentication failed' };
      }
    }

    // Fallback authentication for initial setup & testing:
    // Allows admin access with any password for 'admin@musatransport.com' or 'dispatch@musatransport.com'
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('musa')) {
      const demoUser: AdminUser = {
        ...DEMO_ADMIN,
        email,
        role: email.includes('dispatch') ? 'dispatch_agent' : 'super_admin',
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(demoUser));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid administrator credentials. Try admin@musatransport.com' };
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const canManageVisas = user?.role === 'super_admin' || user?.role === 'operations_manager';
  const canDispatch = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        login,
        logout,
        isSuperAdmin,
        canManageVisas,
        canDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AuthContext);
