/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { "dark-blue": "#1E2B6F", "deep-blue": "#193F5F" },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
