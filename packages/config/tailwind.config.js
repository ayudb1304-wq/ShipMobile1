/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Apps
    '../../apps/web/app/**/*.{js,ts,jsx,tsx}',
    '../../apps/web/components/**/*.{js,ts,jsx,tsx}',
    '../../apps/native/app/**/*.{js,ts,jsx,tsx}',
    '../../apps/native/components/**/*.{js,ts,jsx,tsx}',
    // Packages
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '../../packages/app/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // DaisyUI-compatible semantic colors mapped to CSS variables
        primary: 'var(--color-primary)',
        'primary-focus': 'var(--color-primary-focus)',
        'primary-content': 'var(--color-primary-content)',
        
        secondary: 'var(--color-secondary)',
        'secondary-focus': 'var(--color-secondary-focus)',
        'secondary-content': 'var(--color-secondary-content)',
        
        accent: 'var(--color-accent)',
        'accent-focus': 'var(--color-accent-focus)',
        'accent-content': 'var(--color-accent-content)',
        
        neutral: 'var(--color-neutral)',
        'neutral-focus': 'var(--color-neutral-focus)',
        'neutral-content': 'var(--color-neutral-content)',
        
        'base-100': 'var(--color-base-100)',
        'base-200': 'var(--color-base-200)',
        'base-300': 'var(--color-base-300)',
        'base-content': 'var(--color-base-content)',
        
        info: 'var(--color-info)',
        'info-content': 'var(--color-info-content)',
        
        success: 'var(--color-success)',
        'success-content': 'var(--color-success-content)',
        
        warning: 'var(--color-warning)',
        'warning-content': 'var(--color-warning-content)',
        
        error: 'var(--color-error)',
        'error-content': 'var(--color-error-content)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        box: 'var(--rounded-box)',
        btn: 'var(--rounded-btn)',
        badge: 'var(--rounded-badge)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
