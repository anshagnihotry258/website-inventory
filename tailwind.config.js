/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pec: {
          blue: "#003366",
          darkblue: "#002244",
          lightblue: "#e6f0fa",
          gold: "#D4AF37",
          amber: "#f59e0b",
          red: "#990000",
          green: "#007a3d"
        }
      }
    },
  },
  plugins: [],
};
