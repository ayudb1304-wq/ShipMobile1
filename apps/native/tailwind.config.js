/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the shared config
  ...require('@shipmobile/config/tailwind'),
  
  // Override content paths for native app
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '../../packages/app/**/*.{js,ts,jsx,tsx}',
  ],
};
