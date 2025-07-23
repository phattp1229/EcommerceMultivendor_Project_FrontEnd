/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color": '#00927c', // UI color picker
        "secondary-color": '#EAF0F1', // Example secondary color
    }
  },
  },
  plugins: [],
}