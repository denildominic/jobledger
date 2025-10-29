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
    DEFAULT: "#10B981",
    50:"#ECFDF5",100:"#D1FAE5",200:"#A7F3D0",300:"#6EE7B7",
    400:"#34D399",500:"#10B981",600:"#0EA371",700:"#0B845C",800:"#08694B",900:"#064E3B"
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
