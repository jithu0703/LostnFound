/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lost: {
          bg: '#080610',
          mid: '#100e1a',
          text: '#b0a4cc',
          muted: '#6e6388',
          accent: '#7c5cbf',
        },
        found: {
          bg: '#fdf6e8',
          text: '#1e160a',
          ink: '#7a6448',
          gold: '#c8933a',
          bright: '#e0aa55',
          candle: '#f0c070',
          ember: '#d4773a',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        crimson: ['Crimson Pro', 'serif'],
      }
    },
  },
  plugins: [],
}
