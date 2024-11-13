/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      colors: {
        primary: {
          DEFAULT: "#0a192f",
          hover: "#132f4c",
        },
      },
    },
  },
  plugins: [],
  important: true,
};
