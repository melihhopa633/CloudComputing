/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#0a1a2f',
        'dark-blue': '#162a45',
        'cloud-white': '#ffffff',
      },
    },
  },
  plugins: [],
} 