// Supabase exports
export {
  createSupabaseClient,
  createBrowserSupabaseClient,
  createNativeSupabaseClient,
  getSupabaseConfig,
} from './supabase/client';

export type { SupabaseConfig } from './supabase/client';

// Platform utilities
export { getPlatform, isWeb, isNative, isIOS, isAndroid } from './platform';
