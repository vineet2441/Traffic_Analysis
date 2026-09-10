/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#f2f2f7',
          card: '#ffffff',
          border: 'rgba(0, 0, 0, 0.08)',
          accent: '#007AFF',
          emerald: '#34C759',
          amber: '#FF9500',
          rose: '#FF3B30',
          indigo: '#5856D6',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
