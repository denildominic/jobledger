import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "SF Pro Text", "Arial"],
      },
      colors: {
        brand: {
          // — keep your base color, add a full scale for nicer hovers/gradients
          DEFAULT: "#5b9cff",
          50:  "#eef5ff",
          100: "#dfecff",
          200: "#c3dcff",
          300: "#a3c7ff",
          400: "#82b1ff",
          500: "#5b9cff",
          600: "#3a7bf7", // from your config
          700: "#2f66d4", // from your config
          800: "#274faa", // from your config
          900: "#213f87",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(91,156,255,0.3)", // yours
        soft: "0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)",
        inset: "inset 0 1px 0 rgba(255,255,255,.06)",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
    },
  },
  plugins: [],
};
export default config;
