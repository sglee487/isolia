/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gothica1: ["GothicA1", "sans-serif"],
      }
    },
  },
  plugins: [],
}
