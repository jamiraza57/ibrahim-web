import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        "secondary-background": "#101010",
        card: "#161616",
        gold: "#D4AF37",
        "dark-gold": "#B8860B",
        "secondary-text": "#AFAFAF",
        border: "rgba(212, 175, 55, 0.18)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
