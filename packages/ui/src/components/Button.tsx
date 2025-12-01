import { Pressable, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { cn } from '../utils/cn';

export interface ButtonProps {
  /** Button text content */
  children: string;
  /** Click/Press handler */
  onPress?: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner */
  loading?: boolean;
  /** Additional Tailwind classes */
  className?: string;
  /** Test ID for testing */
  testID?: string;
}

const variantStyles = {
  primary: 'bg-primary active:bg-primary-focus',
  secondary: 'bg-secondary active:bg-secondary-focus',
  accent: 'bg-accent active:bg-accent-focus',
  ghost: 'bg-transparent active:bg-base-200',
  outline: 'bg-transparent border-2 border-primary active:bg-primary/10',
};

const variantTextStyles = {
  primary: 'text-primary-content',
  secondary: 'text-secondary-content',
  accent: 'text-accent-content',
  ghost: 'text-base-content',
  outline: 'text-primary',
};

const sizeStyles = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5',
};

const sizeTextStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      className={cn(
        'flex-row items-center justify-center rounded-btn',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' || variant === 'outline' ? '#6366f1' : '#ffffff'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text
        className={cn(
          'font-semibold text-center',
          variantTextStyles[variant],
          sizeTextStyles[size]
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}
