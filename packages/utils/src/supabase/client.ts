import { Platform } from 'react-native';
import { createClient as createSupabaseJsClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Get Supabase configuration from environment variables.
 * Uses different prefixes for web (NEXT_PUBLIC_) and native (EXPO_PUBLIC_).
 */
export function getSupabaseConfig(): SupabaseConfig {
  if (Platform.OS === 'web') {
    // Web uses NEXT_PUBLIC_ prefix
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      throw new Error(
        'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }

    return { url, anonKey };
  }

  // Native uses EXPO_PUBLIC_ prefix (accessible via expo-constants)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Constants = require('expo-constants').default;
  const url = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey =
    Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase environment variables. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return { url, anonKey };
}

/**
 * Create a Supabase client appropriate for the current platform.
 * 
 * - Web: Uses @supabase/ssr with cookie-based auth for SSR compatibility
 * - Native: Uses @supabase/supabase-js with SecureStore for token persistence
 */
export function createSupabaseClient(): SupabaseClient {
  if (Platform.OS === 'web') {
    return createBrowserSupabaseClient();
  }
  return createNativeSupabaseClient();
}

/**
 * Create a browser-specific Supabase client using @supabase/ssr.
 * Handles cookie-based session management for SSR.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();

  return createBrowserClient(url, anonKey);
}

/**
 * Create a native-specific Supabase client with SecureStore.
 * Tokens are stored securely using expo-secure-store.
 */
export function createNativeSupabaseClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();

  // Dynamic import to prevent bundling on web
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SecureStore = require('expo-secure-store');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  // Custom storage adapter using SecureStore for tokens
  const ExpoSecureStoreAdapter = {
    getItem: async (key: string): Promise<string | null> => {
      try {
        // Try SecureStore first for sensitive data
        const value = await SecureStore.getItemAsync(key);
        if (value) return value;
        // Fallback to AsyncStorage for non-sensitive data
        return await AsyncStorage.getItem(key);
      } catch {
        return await AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        // Store auth tokens in SecureStore
        if (key.includes('auth') || key.includes('token')) {
          await SecureStore.setItemAsync(key, value);
        } else {
          await AsyncStorage.setItem(key, value);
        }
      } catch {
        // Fallback to AsyncStorage if SecureStore fails
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
        // Ignore errors
      }
      try {
        await AsyncStorage.removeItem(key);
      } catch {
        // Ignore errors
      }
    },
  };

  return createSupabaseJsClient(url, anonKey, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
