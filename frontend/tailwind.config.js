/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf8ed",
          100: "#f9eccc",
          200: "#f3d894",
          300: "#ecc15c",
          400: "#e6ab35",
          500: "#d4a853",
          600: "#b8792a",
          700: "#995a24",
          800: "#7d4823",
          900: "#683c21",
        },
        slate: {
          925: "#0f1419",
          950: "#0a0d11",
        },
      },
    },
  },
  plugins: [],
};
