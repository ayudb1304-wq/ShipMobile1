import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'ShipMobile',
    template: '%s | ShipMobile',
  },
  description: 'Universal monorepo for React Native and Next.js applications',
  keywords: ['React Native', 'Next.js', 'Monorepo', 'NativeWind', 'Expo'],
  authors: [{ name: 'ShipMobile Team' }],
  creator: 'ShipMobile',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ShipMobile',
    title: 'ShipMobile - Universal App Development',
    description: 'Build once, deploy everywhere with our universal monorepo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipMobile',
    description: 'Universal monorepo for React Native and Next.js',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
