/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        pink: {
          50: '#fff5f5',
          100: '#FFE8F0',
          150: '#FFD4E6',
          200: '#F4C2C2',
          300: '#FFB3D9',
          400: '#d98484',
          500: '#c96060',
        },
        skyblue: {
          50: '#E0F7FF',
          100: '#B3E9FF',
          200: '#87DAFF',
          300: '#5DCCFF',
          400: '#40BFFF',
          500: '#20A8F3',
        },
        'baby-pink': '#FFE8F0',
        'sky-blue': '#40BFFF',
        cream: {
          50: '#FFFEF8',
          100: '#FFFDD0',
          200: '#FFF9A0',
        },
      },
    },
  },
  plugins: [],
};
