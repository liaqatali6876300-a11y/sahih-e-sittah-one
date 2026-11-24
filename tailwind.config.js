/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        islamic: {
          green: '#064E3B',
          emerald: '#047857',
          sage: '#ECFDF5',
          gold: '#B4832C',
          goldLight: '#D4AF37',
          goldMuted: '#F5EFE0',
        },
      },
      fontFamily: {
        sans: ['"Noto Nastaliq Urdu"', '"Amiri"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Amiri"', 'serif'],
        arabic: ['"Amiri"', 'serif'],
      },
    },
  },
  plugins: [],
};
