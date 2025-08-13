// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to scan for class names
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // A few custom tokens for polish (optional)
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,.06)"
      }
    },
  },
  plugins: [],
};


