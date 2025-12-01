import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@shipmobile/app';

// Import global CSS for NativeWind
import '../../packages/ui/global.css';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Root layout for the Expo app.
 * Sets up navigation, providers, and global configuration.
 */
export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    // Small delay to ensure app is ready
    setTimeout(hideSplash, 500);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
