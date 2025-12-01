import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, Card, Container, Input, Link } from '@shipmobile/ui';
import { useAuth } from '@shipmobile/app';

/**
 * Login screen with email/password and OAuth options
 */
export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithOAuth, signInWithMagicLink, loading } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'magic') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setError(error.message);
        } else {
          setMagicLinkSent(true);
        }
      } else if (mode === 'signup') {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.replace('/');
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.replace('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple' | 'github') => {
    setError(null);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  if (magicLinkSent) {
    return (
      <ScrollView className="flex-1 bg-base-100">
        <Container className="py-16">
          <Card className="max-w-md mx-auto">
            <Text variant="heading" align="center" className="mb-4">
              ✉️ Check Your Email
            </Text>
            <Text variant="body" color="muted" align="center" className="mb-6">
              We've sent a magic link to {email}. Click the link in the email to sign in.
            </Text>
            <Button variant="ghost" onPress={() => setMagicLinkSent(false)}>
              Try a different email
            </Button>
          </Card>
        </Container>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-base-100">
      <Container className="py-16 safe-area-top">
        <Card className="max-w-md mx-auto">
          {/* Header */}
          <View className="mb-6">
            <Link href="/">
              <Text className="text-primary mb-4">← Back to Home</Text>
            </Link>
            <Text variant="heading" align="center">
              {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Magic Link'}
            </Text>
            <Text variant="body" color="muted" align="center">
              {mode === 'signin'
                ? 'Sign in to your account'
                : mode === 'signup'
                ? 'Create a new account'
                : 'Sign in with a magic link'}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 p-3 bg-error/10 rounded-btn">
              <Text variant="caption" className="text-error text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Form */}
          <View className="gap-4 mb-6">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
            />
            
            {mode !== 'magic' && (
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
              />
            )}

            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={loading || isSubmitting}
            >
              {mode === 'signin'
                ? 'Sign In'
                : mode === 'signup'
                ? 'Create Account'
                : 'Send Magic Link'}
            </Button>
          </View>

          {/* Mode Switcher */}
          <View className="gap-2 mb-6">
            {mode !== 'signin' && (
              <Button variant="ghost" onPress={() => setMode('signin')}>
                Already have an account? Sign In
              </Button>
            )}
            {mode !== 'signup' && (
              <Button variant="ghost" onPress={() => setMode('signup')}>
                Don't have an account? Sign Up
              </Button>
            )}
            {mode !== 'magic' && (
              <Button variant="ghost" onPress={() => setMode('magic')}>
                Sign in with Magic Link
              </Button>
            )}
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-base-300" />
            <Text variant="caption" color="muted" className="mx-4">
              OR
            </Text>
            <View className="flex-1 h-px bg-base-300" />
          </View>

          {/* OAuth Buttons */}
          <View className="gap-3">
            <Button variant="outline" onPress={() => handleOAuth('google')}>
              Continue with Google
            </Button>
            <Button variant="outline" onPress={() => handleOAuth('github')}>
              Continue with GitHub
            </Button>
            <Button variant="outline" onPress={() => handleOAuth('apple')}>
              Continue with Apple
            </Button>
          </View>
        </Card>
      </Container>
    </ScrollView>
  );
}
