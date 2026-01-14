/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#264653',
          teal: '#2a9d8f',
          sand: '#e9c46a',
          orange: '#f4a261',
          coral: '#e76f51',
        },
      },
    },
  },
  plugins: [],
}

