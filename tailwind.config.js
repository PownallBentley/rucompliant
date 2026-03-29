/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e40af',
          600: '#1e3a8a',
          700: '#1e3575',
          800: '#1a2e60',
          900: '#15244d',
        },
        status: {
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
