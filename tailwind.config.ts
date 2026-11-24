import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Indigo-violet primary. Green is reserved for "good" signals (emerald).
        brand: {
          50: "#f4f2ff",
          100: "#ebe7ff",
          200: "#d8d0ff",
          300: "#bbaaff",
          400: "#9a7dff",
          500: "#6e4dff",
          600: "#5a36f0",
          700: "#4a28cf",
          800: "#3d22a6",
          900: "#331f84",
          950: "#1d1150",
        },
      },
      backgroundImage: {
        prism: "linear-gradient(100deg, #5a36f0 0%, #a23cf0 38%, #e5409b 68%, #f59e0b 100%)",
        "prism-soft": "linear-gradient(100deg, #ebe7ff 0%, #f6e3ff 40%, #ffe4f1 70%, #fff1d6 100%)",
        "prism-dark": "linear-gradient(135deg, #1d1150 0%, #3d22a6 45%, #8a1fa6 80%, #b4235e 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-inter)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
