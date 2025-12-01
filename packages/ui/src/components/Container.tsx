import { View, ViewProps } from 'react-native';
import { cn } from '../utils/cn';

export interface ContainerProps extends Omit<ViewProps, 'style'> {
  /** Container width variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Add horizontal padding */
  padded?: boolean;
  /** Center content horizontally */
  centered?: boolean;
  /** Additional Tailwind classes */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

const sizeStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'w-full',
};

export function Container({
  size = 'lg',
  padded = true,
  centered = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <View
      className={cn(
        'w-full',
        sizeStyles[size],
        padded && 'px-4',
        centered && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
