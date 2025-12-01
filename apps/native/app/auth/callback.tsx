import { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from '@shipmobile/ui';

/**
 * OAuth callback screen.
 * 
 * This screen handles the redirect from OAuth providers via deep linking.
 * The actual session handling is done in the AuthProvider.
 */
export default function AuthCallbackPage() {
  const params = useLocalSearchParams();

  useEffect(() => {
    // The AuthProvider handles the deep link and sets up the session.
    // After a brief moment, redirect to home.
    const timeout = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-base-100">
      <Text variant="heading" className="mb-4">
        🔐
      </Text>
      <Text variant="body" color="muted">
        Completing sign in...
      </Text>
    </View>
  );
}
