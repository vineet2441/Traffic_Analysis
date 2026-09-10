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
          bg: '#07090e',
          card: '#0f1420',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#007AFF',
          emerald: '#30D158',
          amber: '#FF9F0A',
          rose: '#FF453A',
          indigo: '#5E5CE6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(0, 122, 255, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(48, 209, 88, 0.25)',
        'glow-rose': '0 0 25px -5px rgba(255, 69, 58, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(255, 159, 10, 0.25)',
      }
    },
  },
  plugins: [],
}
