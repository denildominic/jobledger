import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#5b9cff",
          600: "#3a7bf7",
          700: "#2f66d4",
          800: "#274faa"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(91,156,255,0.3)"
      }
    },
  },
  plugins: [],
};
export default config;
