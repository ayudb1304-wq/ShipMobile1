import { Platform } from 'react-native';
import { Button, ButtonProps } from './Button';

export interface RazorpayOptions {
  /** Razorpay API Key ID */
  key: string;
  /** Amount in smallest currency unit (e.g., paise for INR) */
  amount: number;
  /** Currency code (e.g., 'INR') */
  currency: string;
  /** Display name of your company */
  name: string;
  /** Description of the purchase */
  description?: string;
  /** URL of your logo */
  image?: string;
  /** Order ID from your backend */
  order_id?: string;
  /** Prefill customer details */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Additional notes */
  notes?: Record<string, string>;
  /** Theme customization */
  theme?: {
    color?: string;
  };
}

export interface PayButtonProps extends Omit<ButtonProps, 'onPress'> {
  /** Razorpay checkout options */
  options: RazorpayOptions;
  /** Called on successful payment */
  onSuccess?: (response: RazorpaySuccessResponse) => void;
  /** Called on payment failure */
  onError?: (error: RazorpayError) => void;
  /** Called when user dismisses the payment modal */
  onDismiss?: () => void;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayError {
  code: number;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, unknown>;
}

/**
 * Cross-platform Pay Button for Razorpay integration.
 * 
 * **IMPORTANT**: On native (iOS/Android), this requires:
 * 1. Running `npx expo prebuild` to generate native projects
 * 2. Using `npx expo run:ios` or `npx expo run:android` (Dev Client)
 * 3. Will NOT work in Expo Go due to native module requirements
 * 
 * @example
 * <PayButton
 *   options={{
 *     key: 'rzp_test_xxx',
 *     amount: 50000, // ₹500.00
 *     currency: 'INR',
 *     name: 'ShipMobile Store',
 *     description: 'Premium Subscription',
 *     prefill: {
 *       email: 'user@example.com',
 *       contact: '9876543210',
 *     },
 *   }}
 *   onSuccess={(response) => console.log('Payment successful:', response)}
 *   onError={(error) => console.error('Payment failed:', error)}
 * >
 *   Pay ₹500
 * </PayButton>
 */
export function PayButton({
  options,
  onSuccess,
  onError,
  onDismiss,
  ...buttonProps
}: PayButtonProps) {
  const handlePress = async () => {
    if (Platform.OS === 'web') {
      await handleWebPayment(options, onSuccess, onError, onDismiss);
    } else {
      await handleNativePayment(options, onSuccess, onError);
    }
  };

  return <Button {...buttonProps} onPress={handlePress} />;
}

/**
 * Web implementation using Razorpay checkout.js
 */
async function handleWebPayment(
  options: RazorpayOptions,
  onSuccess?: (response: RazorpaySuccessResponse) => void,
  onError?: (error: RazorpayError) => void,
  onDismiss?: () => void
): Promise<void> {
  // Load Razorpay script if not already loaded
  if (typeof window !== 'undefined' && !window.Razorpay) {
    await loadRazorpayScript();
  }

  if (typeof window === 'undefined' || !window.Razorpay) {
    onError?.({
      code: 0,
      description: 'Razorpay SDK failed to load',
      source: 'web',
      step: 'init',
      reason: 'sdk_load_failed',
      metadata: {},
    });
    return;
  }

  const razorpay = new window.Razorpay({
    ...options,
    handler: (response: RazorpaySuccessResponse) => {
      onSuccess?.(response);
    },
    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
      escape: true,
      animation: true,
    },
  });

  razorpay.on('payment.failed', (response: { error: RazorpayError }) => {
    onError?.(response.error);
  });

  razorpay.open();
}

/**
 * Load Razorpay checkout.js script dynamically
 */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Document not available'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
}

/**
 * Native implementation using react-native-razorpay
 */
async function handleNativePayment(
  options: RazorpayOptions,
  onSuccess?: (response: RazorpaySuccessResponse) => void,
  onError?: (error: RazorpayError) => void
): Promise<void> {
  try {
    // Dynamic require to prevent bundling on web
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RazorpayCheckout = require('react-native-razorpay').default;

    const data = await RazorpayCheckout.open(options);
    onSuccess?.(data);
  } catch (error) {
    const razorpayError = error as RazorpayError;
    onError?.(razorpayError);
  }
}

// Type augmentation for window object
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions & {
      handler: (response: RazorpaySuccessResponse) => void;
      modal?: {
        ondismiss?: () => void;
        escape?: boolean;
        animation?: boolean;
      };
    }) => {
      open: () => void;
      on: (event: string, handler: (response: { error: RazorpayError }) => void) => void;
    };
  }
}
