import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          dark: "#0a0a0a",
        },
      },
      keyframes: {
        "lens-pulse": {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(1.04)" },
        },
      },
      animation: {
        "lens-pulse": "lens-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
