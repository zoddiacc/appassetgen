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
        // Channel-based so opacity modifiers (primary/10) work and the
        // actual hue adapts per theme via globals.css
        primary: "rgb(var(--primary-rgb) / <alpha-value>)",
        "primary-hover": "rgb(var(--accent-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        success: "#10B981",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
