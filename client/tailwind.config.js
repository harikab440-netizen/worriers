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
        navy: {
          950: '#0a0e17',
          900: '#101626',
          850: '#161f36',
          800: '#1c2744',
          750: '#233154',
          700: '#2d3d66',
          600: '#3e5285',
        },
        plum: {
          950: '#150d1e',
          900: '#21142e',
          850: '#2d1b3e',
          800: '#3c2452',
          700: '#533271',
          600: '#75479e',
          500: '#a855f7',
          400: '#c084fc',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

