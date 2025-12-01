import { Platform } from 'react-native';

export type AppPlatform = 'web' | 'ios' | 'android';

/**
 * Get the current platform as a typed string
 */
export function getPlatform(): AppPlatform {
  if (Platform.OS === 'web') return 'web';
  if (Platform.OS === 'ios') return 'ios';
  return 'android';
}

/**
 * Check if running on web
 */
export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Check if running on native (iOS or Android)
 */
export function isNative(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return Platform.OS === 'android';
}
