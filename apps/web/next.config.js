/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Transpile monorepo packages and NativeWind dependencies
  transpilePackages: [
    '@shipmobile/ui',
    '@shipmobile/app',
    '@shipmobile/utils',
    'nativewind',
    'react-native-css-interop',
    'react-native-web',
    'solito',
  ],

  // Configure webpack for React Native Web compatibility
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias react-native to react-native-web
      'react-native$': 'react-native-web',
    };

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    return config;
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@shipmobile/ui', '@shipmobile/app'],
  },
};

module.exports = nextConfig;
