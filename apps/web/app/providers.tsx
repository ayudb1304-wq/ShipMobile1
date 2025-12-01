'use client';

import { AuthProvider } from '@shipmobile/app';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper for the web app.
 * 
 * Add any client-side providers here (auth, theme, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
