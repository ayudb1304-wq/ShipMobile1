import { View, ScrollView } from 'react-native';
import { Button, Text, Card, Container, Link } from '@shipmobile/ui';
import { useAuth } from '../../provider/auth';

/**
 * Profile Screen - Shared between Web and Native
 * 
 * Displays user profile information and auth actions.
 */
export function ProfileScreen() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-base-100">
        <Text variant="body" color="muted">Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-base-100 px-4">
        <Card className="w-full max-w-md">
          <Text variant="heading" align="center" className="mb-2">
            Sign In Required
          </Text>
          <Text variant="body" color="muted" align="center" className="mb-6">
            Please sign in to view your profile.
          </Text>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Sign In
            </Button>
          </Link>
          <View className="mt-4">
            <Link href="/">
              <Text align="center" className="text-primary underline">
                ← Back to Home
              </Text>
            </Link>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-base-100">
      <Container className="py-8">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-4">
            <Text variant="heading" className="text-primary-content">
              {user.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text variant="heading" className="mb-1">
            {user.email || 'User'}
          </Text>
          <Text variant="caption" color="muted">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Profile Details */}
        <Card className="mb-6">
          <Text variant="subheading" className="mb-4">
            Account Details
          </Text>

          <ProfileRow label="User ID" value={user.id} />
          <ProfileRow label="Email" value={user.email || 'Not set'} />
          <ProfileRow label="Phone" value={user.phone || 'Not set'} />
          <ProfileRow
            label="Email Verified"
            value={user.emailConfirmedAt ? '✅ Yes' : '❌ No'}
          />
          <ProfileRow
            label="Last Sign In"
            value={
              user.lastSignInAt
                ? new Date(user.lastSignInAt).toLocaleString()
                : 'Never'
            }
          />
        </Card>

        {/* Actions */}
        <View className="gap-3">
          <Button variant="secondary" onPress={handleSignOut}>
            Sign Out
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full">
              ← Back to Home
            </Button>
          </Link>
        </View>
      </Container>
    </ScrollView>
  );
}

interface ProfileRowProps {
  label: string;
  value: string;
}

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <View className="flex-row justify-between py-2 border-b border-base-200 last:border-b-0">
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <Text variant="caption" className="font-medium text-right flex-1 ml-4">
        {value}
      </Text>
    </View>
  );
}
