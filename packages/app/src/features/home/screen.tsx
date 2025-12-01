import { View, ScrollView } from 'react-native';
import { Button, Text, Card, Container, Link } from '@shipmobile/ui';
import { useAuth } from '../../provider/auth';

/**
 * Home Screen - Shared between Web and Native
 * 
 * This screen demonstrates:
 * - Shared UI components from @shipmobile/ui
 * - Auth context usage
 * - Cross-platform navigation with Solito
 */
export function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-base-100">
        <Text variant="body" color="muted">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-base-100">
      <Container className="py-8">
        {/* Hero Section */}
        <View className="mb-8">
          <Text variant="heading" className="mb-2">
            Welcome to ShipMobile
          </Text>
          <Text variant="body" color="muted">
            A universal monorepo for React Native and Next.js
          </Text>
        </View>

        {/* Auth Status Card */}
        <Card className="mb-6">
          <Text variant="subheading" className="mb-3">
            Authentication Status
          </Text>
          {user ? (
            <View>
              <Text variant="body" className="mb-1">
                ✅ Signed in as:
              </Text>
              <Text variant="caption" color="muted" className="mb-3">
                {user.email || user.phone || 'Anonymous User'}
              </Text>
              <Link href="/profile">
                <Text className="text-primary underline">View Profile →</Text>
              </Link>
            </View>
          ) : (
            <View>
              <Text variant="body" color="muted" className="mb-3">
                Not signed in. Sign in to access all features.
              </Text>
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            </View>
          )}
        </Card>

        {/* Features Grid */}
        <Text variant="subheading" className="mb-4">
          Features
        </Text>

        <View className="gap-4">
          <FeatureCard
            title="🎨 NativeWind v4"
            description="CSS-first styling with Tailwind utilities that work on both platforms."
          />
          <FeatureCard
            title="🔐 Supabase Auth"
            description="SSR-compatible authentication with SecureStore for native."
          />
          <FeatureCard
            title="💳 Razorpay Payments"
            description="Native SDK integration with Config Plugin support."
          />
          <FeatureCard
            title="🧭 Solito Navigation"
            description="Unified routing between Next.js and Expo Router."
          />
        </View>

        {/* Quick Actions */}
        <View className="mt-8 gap-3">
          <Link href="/payment">
            <Button variant="primary" className="w-full">
              Try Payment Demo
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        </View>
      </Container>
    </ScrollView>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <Card variant="outlined">
      <Text variant="subheading" className="mb-1">
        {title}
      </Text>
      <Text variant="caption" color="muted">
        {description}
      </Text>
    </Card>
  );
}
