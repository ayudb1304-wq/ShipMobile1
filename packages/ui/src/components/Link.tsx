import { ComponentProps } from 'react';
import { Platform, Pressable } from 'react-native';
import { Text } from './Text';
import { cn } from '../utils/cn';

export interface LinkProps {
  /** Target URL or route path */
  href: string;
  /** Link text or children */
  children: React.ReactNode;
  /** Additional Tailwind classes */
  className?: string;
  /** Text classes */
  textClassName?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Cross-platform Link component using Solito.
 * 
 * - On Web: Uses Next.js Link for client-side navigation
 * - On Native: Uses Solito Link which wraps Expo Router
 * 
 * @example
 * <Link href="/profile">View Profile</Link>
 * <Link href="https://example.com">External Link</Link>
 */
export function Link({ href, children, className, textClassName, testID }: LinkProps) {
  // For web, we need to dynamically import to avoid bundling issues
  if (Platform.OS === 'web') {
    return (
      <WebLink href={href} className={className} testID={testID}>
        {typeof children === 'string' ? (
          <Text className={cn('text-primary underline', textClassName)}>{children}</Text>
        ) : (
          children
        )}
      </WebLink>
    );
  }

  return (
    <NativeLink href={href} className={className} testID={testID}>
      {typeof children === 'string' ? (
        <Text className={cn('text-primary underline', textClassName)}>{children}</Text>
      ) : (
        children
      )}
    </NativeLink>
  );
}

// Web-specific implementation using Next.js Link
function WebLink({ href, children, className, testID }: LinkProps) {
  // Dynamic require for Next.js link to prevent bundling issues on native
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NextLink = require('next/link').default;
  
  return (
    <NextLink
      href={href}
      className={className}
      data-testid={testID}
    >
      {children}
    </NextLink>
  );
}

// Native-specific implementation using Solito
function NativeLink({ href, children, className, testID }: LinkProps) {
  // Dynamic require for Solito to prevent bundling issues on web
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Link: SolitoLink } = require('solito/link');
  
  return (
    <SolitoLink href={href}>
      <Pressable className={className} testID={testID}>
        {children}
      </Pressable>
    </SolitoLink>
  );
}
