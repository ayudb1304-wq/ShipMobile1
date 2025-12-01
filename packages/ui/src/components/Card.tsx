import { View, ViewProps } from 'react-native';
import { cn } from '../utils/cn';

export interface CardProps extends Omit<ViewProps, 'style'> {
  /** Card visual variant */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Additional Tailwind classes */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const variantStyles = {
  elevated: 'bg-base-100 shadow-md',
  outlined: 'bg-transparent border border-base-300',
  filled: 'bg-base-200',
};

export function Card({
  variant = 'elevated',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(
        'rounded-box p-4',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
