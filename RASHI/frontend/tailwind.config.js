/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf2f6",
          100: "#fbe6ee",
          200: "#f6c2d7",
          300: "#f090b3",
          400: "#e8578a",
          500: "#d6216a",
          600: "#b91557",
          700: "#960f48",
          800: "#78103c",
          900: "#651035",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
