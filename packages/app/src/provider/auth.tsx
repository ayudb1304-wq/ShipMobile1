import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { createSupabaseClient } from '@shipmobile/utils/supabase/client';

export interface AuthUser {
  id: string;
  email: string | undefined;
  phone: string | undefined;
  createdAt: string;
  updatedAt: string;
  emailConfirmedAt: string | undefined;
  phoneConfirmedAt: string | undefined;
  lastSignInAt: string | undefined;
  appMetadata: Record<string, unknown>;
  userMetadata: Record<string, unknown>;
}

export interface AuthContextValue {
  /** Current authenticated user or null */
  user: AuthUser | null;
  /** Current session or null */
  session: Session | null;
  /** Loading state during initial auth check */
  loading: boolean;
  /** Sign in with email and password */
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  /** Sign up with email and password */
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  /** Sign in with OAuth provider (Google, Apple, etc.) */
  signInWithOAuth: (provider: 'google' | 'apple' | 'github') => Promise<{ error: AuthError | null }>;
  /** Sign in with magic link */
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  /** Sign out the current user */
  signOut: () => Promise<{ error: AuthError | null }>;
  /** Refresh the current session */
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider for ShipMobile.
 * 
 * Handles:
 * - Session persistence and restoration
 * - OAuth deep linking (native)
 * - Auth state changes
 * 
 * Wrap your app with this provider:
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create Supabase client
  const supabase = createSupabaseClient();

  // Transform Supabase User to AuthUser
  const transformUser = useCallback((supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      phone: supabaseUser.phone,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at ?? supabaseUser.created_at,
      emailConfirmedAt: supabaseUser.email_confirmed_at,
      phoneConfirmedAt: supabaseUser.phone_confirmed_at,
      lastSignInAt: supabaseUser.last_sign_in_at,
      appMetadata: supabaseUser.app_metadata,
      userMetadata: supabaseUser.user_metadata,
    };
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(transformUser(initialSession?.user ?? null));
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(transformUser(newSession?.user ?? null));

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, transformUser]);

  // Handle OAuth deep linking on native
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const handleDeepLink = async (url: string) => {
      // Parse the URL for auth tokens
      if (url.includes('access_token') || url.includes('refresh_token')) {
        try {
          // Extract tokens from URL hash/query
          const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Error setting session from deep link:', error);
            }
          }
        } catch (error) {
          console.error('Error handling deep link:', error);
        }
      }
    };

    // Set up deep link listener
    const setupDeepLinking = async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Linking = require('expo-linking');

      // Handle initial URL (app opened via deep link)
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }

      // Listen for incoming links
      const subscription = Linking.addEventListener('url', ({ url }: { url: string }) => {
        handleDeepLink(url);
      });

      return () => {
        subscription.remove();
      };
    };

    setupDeepLinking();
  }, [supabase]);

  // Auth methods
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'apple' | 'github') => {
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      return { error };
    }

    // Native OAuth flow
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Linking = require('expo-linking');
    const redirectUrl = Linking.createURL('auth/callback');

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });

    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      });
      return { error };
    }

    // Native magic link flow
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Linking = require('expo-linking');
    const redirectUrl = Linking.createURL('auth/callback');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshSession = async () => {
    const { data: { session: newSession } } = await supabase.auth.refreshSession();
    setSession(newSession);
    setUser(transformUser(newSession?.user ?? null));
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signInWithMagicLink,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
