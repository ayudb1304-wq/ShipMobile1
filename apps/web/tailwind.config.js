/** @type {import('tailwindcss').Config} */
module.exports = {
  // Extend the shared config
  ...require('@shipmobile/config/tailwind'),
  
  // Override content paths for web app
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    '../../packages/app/**/*.{js,ts,jsx,tsx}',
  ],
};
