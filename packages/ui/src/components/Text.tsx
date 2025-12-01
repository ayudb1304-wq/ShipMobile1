import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '../utils/cn';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** Text variant for semantic styling */
  variant?: 'body' | 'heading' | 'subheading' | 'caption' | 'label';
  /** Text color using theme colors */
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'error' | 'success';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Additional Tailwind classes */
  className?: string;
  /** Text content */
  children: React.ReactNode;
}

const variantStyles = {
  body: 'text-base leading-relaxed',
  heading: 'text-2xl font-bold tracking-tight',
  subheading: 'text-lg font-semibold',
  caption: 'text-sm',
  label: 'text-sm font-medium uppercase tracking-wide',
};

const colorStyles = {
  default: 'text-base-content',
  muted: 'text-base-content/60',
  primary: 'text-primary',
  secondary: 'text-secondary',
  error: 'text-error',
  success: 'text-success',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Text({
  variant = 'body',
  color = 'default',
  align = 'left',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}
