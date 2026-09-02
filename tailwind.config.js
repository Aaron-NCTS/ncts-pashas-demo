/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#100E0C',
          900: '#171310',
          800: '#221C17',
          700: '#332A22',
          600: '#4A3D30',
        },
        gold: {
          100: '#F4E9CE',
          200: '#E8D5A3',
          300: '#D9BD79',
          400: '#C6A15B',
          500: '#B08D3F',
          600: '#8C6D2E',
          700: '#6B5122',
        },
        ivory: {
          50: '#FBF9F4',
          100: '#F3EEE4',
          200: '#E7DFCF',
        },
        oxblood: {
          500: '#7A2431',
          600: '#5B1A1A',
        },
        signal: {
          green: '#3F7A4E',
          amber: '#B0791F',
          red: '#A83B3B',
          blue: '#3B6EA8',
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(16,14,12,0.06)',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
      }
    },
  },
  plugins: [],
}
