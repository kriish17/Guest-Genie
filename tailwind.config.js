/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marriott: {
          primary: '#0078D2',    // Marriott Blue
          secondary: '#F0F0F0',  // Light Gray
          accent: '#FFB81C',     // Marriott Gold
          dark: '#1A1A1A',       // Dark Gray
          success: '#28A745',    // Success Green
          error: '#DC3545',      // Error Red
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
} 