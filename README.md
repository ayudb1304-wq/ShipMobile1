# 🚀 ShipMobile - Universal Monorepo

A production-ready, type-safe monorepo that shares **90%+ of code** between a **Next.js 15 Web App** and an **Expo SDK 52 Mobile App**.

## ✨ Features

- **📦 Turborepo** - Fast, incremental builds with smart caching
- **🌐 Next.js 15** - React 19 RC with App Router
- **📱 Expo SDK 52** - Managed workflow with Expo Router
- **🎨 NativeWind v4** - CSS-first styling with Tailwind utilities
- **🔐 Supabase Auth** - SSR for Web, SecureStore for Mobile
- **💳 Razorpay** - Native SDK with Config Plugin
- **🧭 Solito** - Unified navigation between platforms
- **📝 TypeScript** - Strict mode throughout

## 📁 Project Structure

```
shipmobile/
├── apps/
│   ├── web/                 # Next.js 15 Web App
│   │   ├── app/             # App Router pages
│   │   ├── middleware.ts    # Supabase session middleware
│   │   └── ...
│   └── native/              # Expo SDK 52 Mobile App
│       ├── app/             # Expo Router pages
│       ├── app.json         # Expo configuration
│       └── ...
├── packages/
│   ├── ui/                  # Shared UI components (NativeWind)
│   │   ├── src/components/  # Button, Card, Input, Link, PayButton
│   │   ├── global.css       # DaisyUI-compatible theme
│   │   └── ...
│   ├── app/                 # Shared business logic & screens
│   │   ├── src/provider/    # AuthProvider
│   │   ├── src/features/    # HomeScreen, ProfileScreen, PaymentScreen
│   │   └── ...
│   ├── utils/               # Shared utilities
│   │   ├── src/supabase/    # Supabase client factory
│   │   └── ...
│   └── config/              # Shared configurations
│       ├── tailwind.config.js
│       ├── eslint.config.js
│       └── tsconfig.*.json
├── .cursorrules             # AI coding assistant rules
├── turbo.json               # Turborepo pipeline config
└── package.json             # Root package with overrides
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shipmobile

# Install dependencies
pnpm install
```

### Environment Setup

Create environment files:

```bash
# For web (apps/web/.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# For native (apps/native/.env)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start only web
pnpm dev:web

# Start only native
pnpm dev:native
```

**Web**: Open [http://localhost:3000](http://localhost:3000)

**Native**: Scan the QR code with Expo Go (limited features) or use Dev Client

## 🔐 Supabase Configuration

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings → API

### 2. Configure OAuth Providers (Optional)

For Google, GitHub, or Apple authentication:

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable and configure the providers you want to use
3. Add your OAuth redirect URLs:
   - Web: `http://localhost:3000/auth/callback` (development)
   - Native: `shipmobile://auth/callback`

### 3. Set Environment Variables

Make sure to set the environment variables as shown in the Environment Setup section.

## 💳 Razorpay Integration

### Important: Dev Client Required

Razorpay uses native SDK modules that are **not available in Expo Go**. You must use a Development Client.

### Setup Steps

1. **Generate native projects:**
   ```bash
   cd apps/native
   npx expo prebuild
   ```

2. **Run on device/simulator:**
   ```bash
   # iOS
   npx expo run:ios

   # Android
   npx expo run:android
   ```

3. **Test with test cards:**
   - Card: `4111 1111 1111 1111`
   - Expiry: Any future date
   - CVV: Any 3 digits

### Web Testing

On web, Razorpay works automatically via script injection. No additional setup needed.

## 🎨 Styling with NativeWind v4

This project uses NativeWind v4 with a CSS-first approach. Styles are defined in `packages/ui/global.css` with CSS variables for theming.

### Theme Colors (DaisyUI Compatible)

```jsx
// Primary actions
<View className="bg-primary" />
<Text className="text-primary-content" />

// Secondary elements
<View className="bg-secondary" />

// Semantic colors
<View className="bg-success" />  // Green
<View className="bg-warning" />  // Yellow
<View className="bg-error" />    // Red

// Background layers
<View className="bg-base-100" /> // Main background
<View className="bg-base-200" /> // Secondary background
```

### DO NOT Use DaisyUI Component Classes

```jsx
// ❌ DON'T - Will break on React Native
<button className="btn btn-primary">

// ✅ DO - Use utility classes
<Pressable className="bg-primary px-4 py-2 rounded-btn">
```

## 🧭 Navigation with Solito

Solito bridges Next.js and Expo Router for universal navigation.

### Usage

```tsx
import { Link } from '@shipmobile/ui';

// Works on both platforms
<Link href="/profile">View Profile</Link>
<Link href="https://example.com">External Link</Link>
```

### Programmatic Navigation

```tsx
// Web (Next.js)
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/profile');

// Native (Expo Router)
import { router } from 'expo-router';
router.push('/profile');
```

## 🔧 React Version Management

This project uses React 19 RC for Next.js 15 compatibility. The root `package.json` includes version overrides:

```json
{
  "pnpm": {
    "overrides": {
      "react": "19.0.0-rc-66855b96-20241106",
      "react-dom": "19.0.0-rc-66855b96-20241106",
      "@types/react": "^18.2.79"
    }
  }
}
```

### Resolving "Invalid Hook Call" Errors

If you encounter "Invalid Hook Call" errors:

1. **Check for duplicate React versions:**
   ```bash
   pnpm why react
   ```

2. **Clear caches and reinstall:**
   ```bash
   pnpm clean
   rm -rf node_modules
   pnpm install
   ```

3. **Ensure overrides are applied:**
   The root package.json overrides should force consistent versions.

## 📱 Asset Setup

Create the following assets in `apps/native/assets/`:

- `icon.png` - App icon (1024x1024)
- `splash.png` - Splash screen (1242x2436)
- `adaptive-icon.png` - Android adaptive icon (1024x1024)
- `favicon.png` - Web favicon (48x48)

## 🏗️ Build & Deploy

### Web (Vercel)

```bash
# Build
pnpm build:web

# Or deploy directly
vercel --prod
```

### Native (EAS)

```bash
cd apps/native

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📋 Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm dev:web` | Start web app only |
| `pnpm dev:native` | Start native app only |
| `pnpm build` | Build all apps |
| `pnpm build:web` | Build web app |
| `pnpm lint` | Run linting |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm clean` | Clean all build artifacts |

## 🤝 Contributing

1. Follow the coding guidelines in `.cursorrules`
2. Use absolute imports from workspace packages
3. Never use `"use client"` in shared components
4. Test on both web and native before submitting

## 📄 License

MIT License - feel free to use this template for your projects!

---

Built with ❤️ using Turborepo, Next.js, Expo, and NativeWind
