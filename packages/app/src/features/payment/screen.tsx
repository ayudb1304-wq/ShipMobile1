import { useState } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import { Button, Text, Card, Container, PayButton, Input, Link } from '@shipmobile/ui';
import type { RazorpayOptions } from '@shipmobile/ui';

/**
 * Payment Screen - Demonstrates Razorpay integration
 * 
 * IMPORTANT: On native (iOS/Android), this requires:
 * 1. Running `npx expo prebuild`
 * 2. Using `npx expo run:ios` or `npx expo run:android`
 * 3. Will NOT work in Expo Go
 */
export function PaymentScreen() {
  const [amount, setAmount] = useState('500');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handlePaymentSuccess = (response: { razorpay_payment_id: string }) => {
    setLoading(false);
    setPaymentStatus('success');
    setPaymentId(response.razorpay_payment_id);

    if (Platform.OS === 'web') {
      // Web alert
      alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
    } else {
      // Native alert
      Alert.alert('Payment Successful', `Payment ID: ${response.razorpay_payment_id}`);
    }
  };

  const handlePaymentError = (error: { description: string }) => {
    setLoading(false);
    setPaymentStatus('error');

    if (Platform.OS === 'web') {
      alert(`Payment failed: ${error.description}`);
    } else {
      Alert.alert('Payment Failed', error.description);
    }
  };

  // Razorpay options
  const razorpayOptions: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo',
    amount: parseInt(amount) * 100, // Convert to paise
    currency: 'INR',
    name: 'ShipMobile Store',
    description: 'Premium Subscription',
    image: 'https://via.placeholder.com/150',
    prefill: {
      name: 'Test User',
      email: 'test@example.com',
      contact: '9876543210',
    },
    theme: {
      color: '#6366f1', // Primary color
    },
    notes: {
      product: 'premium-subscription',
      version: '1.0.0',
    },
  };

  return (
    <ScrollView className="flex-1 bg-base-100">
      <Container className="py-8">
        {/* Header */}
        <View className="mb-8">
          <Link href="/">
            <Text className="text-primary mb-4">← Back to Home</Text>
          </Link>
          <Text variant="heading" className="mb-2">
            Payment Demo
          </Text>
          <Text variant="body" color="muted">
            Test Razorpay integration on both platforms
          </Text>
        </View>

        {/* Platform Notice */}
        {Platform.OS !== 'web' && (
          <Card variant="filled" className="mb-6 bg-warning/10">
            <Text variant="caption" className="text-warning">
              ⚠️ Native payments require Dev Client. If you're using Expo Go, payments
              will not work. Run `npx expo prebuild` and `npx expo run:ios` to test.
            </Text>
          </Card>
        )}

        {/* Amount Input */}
        <Card className="mb-6">
          <Text variant="subheading" className="mb-4">
            Enter Amount
          </Text>
          <View className="flex-row items-center gap-3">
            <Text variant="heading">₹</Text>
            <Input
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="500"
              className="flex-1"
            />
          </View>
        </Card>

        {/* Payment Summary */}
        <Card variant="outlined" className="mb-6">
          <Text variant="subheading" className="mb-4">
            Order Summary
          </Text>
          <View className="gap-2">
            <SummaryRow label="Product" value="Premium Subscription" />
            <SummaryRow label="Amount" value={`₹${amount}`} />
            <SummaryRow label="Tax" value="Included" />
            <View className="border-t border-base-300 mt-2 pt-2">
              <SummaryRow
                label="Total"
                value={`₹${amount}`}
                isBold
              />
            </View>
          </View>
        </Card>

        {/* Payment Button */}
        <PayButton
          options={razorpayOptions}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onDismiss={() => setLoading(false)}
          loading={loading}
          variant="primary"
          size="lg"
          className="w-full mb-4"
        >
          {loading ? 'Processing...' : `Pay ₹${amount}`}
        </PayButton>

        {/* Payment Status */}
        {paymentStatus === 'success' && paymentId && (
          <Card variant="filled" className="bg-success/10">
            <Text variant="subheading" className="text-success mb-2">
              ✅ Payment Successful
            </Text>
            <Text variant="caption" color="muted">
              Payment ID: {paymentId}
            </Text>
          </Card>
        )}

        {paymentStatus === 'error' && (
          <Card variant="filled" className="bg-error/10">
            <Text variant="subheading" className="text-error mb-2">
              ❌ Payment Failed
            </Text>
            <Text variant="caption" color="muted">
              Please try again or use a different payment method.
            </Text>
          </Card>
        )}

        {/* Test Card Info */}
        <Card className="mt-6">
          <Text variant="subheading" className="mb-3">
            Test Card Details
          </Text>
          <Text variant="caption" color="muted" className="mb-2">
            Use these details for testing:
          </Text>
          <View className="gap-1">
            <Text variant="caption">Card: 4111 1111 1111 1111</Text>
            <Text variant="caption">Expiry: Any future date</Text>
            <Text variant="caption">CVV: Any 3 digits</Text>
          </View>
        </Card>
      </Container>
    </ScrollView>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  isBold?: boolean;
}

function SummaryRow({ label, value, isBold }: SummaryRowProps) {
  return (
    <View className="flex-row justify-between">
      <Text variant="caption" color={isBold ? 'default' : 'muted'} className={isBold ? 'font-semibold' : ''}>
        {label}
      </Text>
      <Text variant="caption" className={isBold ? 'font-bold' : 'font-medium'}>
        {value}
      </Text>
    </View>
  );
}
