import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isClientSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  updateProfile: (displayName: string) => Promise<{ error?: string }>;
  switchDemoUser: (userId: 'user-demo-1' | 'user-demo-2') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, UserProfile> = {
  'user-demo-1': {
    id: 'user-demo-1',
    email: 'alex.rivera@campus.edu',
    display_name: 'Alex Rivera'
  },
  'user-demo-2': {
    id: 'user-demo-2',
    email: 'jordan.lee@campus.edu',
    display_name: 'Jordan Lee'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check local storage for mock/demo session first
      const storedDemoUserId = localStorage.getItem('campus_demo_user');
      if (storedDemoUserId && DEMO_USERS[storedDemoUserId]) {
        if (mounted) {
          setUser(DEMO_USERS[storedDemoUserId]);
          setToken(`mock-user-${storedDemoUserId}`);
          setLoading(false);
        }
        return;
      }

      // 2. If Supabase is configured, check real session
      if (isClientSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session?.user) {
            const sbUser = data.session.user;
            const profile: UserProfile = {
              id: sbUser.id,
              email: sbUser.email || '',
              display_name:
                sbUser.user_metadata?.display_name ||
                sbUser.email?.split('@')[0] ||
                'Campus Student'
            };
            if (mounted) {
              setUser(profile);
              setToken(data.session.access_token);
            }
          }
        } catch (e) {
          console.warn('Failed to restore Supabase session', e);
        }
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    // Listen for Supabase auth state change
    if (isClientSupabaseConfigured()) {
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            display_name:
              session.user.user_metadata?.display_name ||
              session.user.email?.split('@')[0] ||
              'Campus Student'
          });
          setToken(session.access_token);
        } else {
          // Only clear if not in demo session
          const storedDemo = localStorage.getItem('campus_demo_user');
          if (!storedDemo) {
            setUser(null);
            setToken(null);
          }
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ error?: string }> => {
    if (isClientSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName }
          }
        });
        if (error) return { error: error.message };
        if (data.session) {
          setToken(data.session.access_token);
          setUser({
            id: data.user!.id,
            email: data.user!.email || email,
            display_name: displayName
          });
        }
        return {};
      } catch (err: any) {
        return { error: err.message || 'Registration failed' };
      }
    }

    // Mock signup for dev / demo mode
    const mockId = `mock-${Date.now()}`;
    const newUser: UserProfile = {
      id: mockId,
      email,
      display_name: displayName
    };
    setUser(newUser);
    setToken(`mock-user-${mockId}`);
    localStorage.setItem('campus_demo_user', mockId);
    DEMO_USERS[mockId] = newUser;
    return {};
  };

  // Sign In
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (isClientSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) return { error: error.message };
        if (data.session) {
          setToken(data.session.access_token);
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            display_name:
              data.user.user_metadata?.display_name || email.split('@')[0] || 'Campus Student'
          });
          localStorage.removeItem('campus_demo_user');
        }
        return {};
      } catch (err: any) {
        return { error: err.message || 'Sign in failed' };
      }
    }

    // Mock sign in fallback
    const matched = Object.values(DEMO_USERS).find((u) => u.email === email);
    const demoUser = matched || {
      id: 'user-demo-1',
      email,
      display_name: email.split('@')[0] || 'Campus Student'
    };
    setUser(demoUser);
    setToken(`mock-user-${demoUser.id}`);
    localStorage.setItem('campus_demo_user', demoUser.id);
    return {};
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    localStorage.removeItem('campus_demo_user');
    setUser(null);
    setToken(null);
    if (isClientSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  };

  // Reset Password Request
  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    if (isClientSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to send password reset' };
      }
    }
    return {};
  };

  // Set New Password from recovery flow
  const updatePassword = async (password: string): Promise<{ error?: string }> => {
    if (isClientSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err.message || 'Failed to update password' };
      }
    }
    return {};
  };

  // Update Display Name
  const updateProfile = async (displayName: string): Promise<{ error?: string }> => {
    if (!user) return { error: 'Not authenticated' };

    try {
      if (isClientSupabaseConfigured()) {
        await supabase.auth.updateUser({
          data: { display_name: displayName }
        });
      }
      setUser((prev) => (prev ? { ...prev, display_name: displayName } : null));
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to update profile' };
    }
  };

  // Quick switch between Demo accounts
  const switchDemoUser = (userId: 'user-demo-1' | 'user-demo-2') => {
    const demo = DEMO_USERS[userId];
    if (demo) {
      setUser(demo);
      setToken(`mock-user-${demo.id}`);
      localStorage.setItem('campus_demo_user', demo.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        switchDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
