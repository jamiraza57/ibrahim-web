import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#f5f0e6",
        "secondary-background": "#141210",
        surface: "#141210",
        "surface-2": "#1c1917",
        card: "#141210",
        "card-foreground": "#f5f0e6",
        // Sampled directly from public/logo-mark.png's gold gradient rather
        // than a generic gold hex: F0D89C is the dominant lit-surface tone
        // (~9% of opaque non-outline pixels), FCE4B8 its highlight, B08D5A
        // its shadow — so the site's "gold" reads as the same metal as the
        // logo instead of a flatter, more saturated yellow-gold.
        gold: "#F0D89C",
        "gold-soft": "#FCE4B8",
        "gold-foreground": "#1a1208",
        "dark-gold": "#B08D5A",
        "secondary-text": "#B8B0A0",
        muted: "#1c1917",
        "muted-foreground": "#B8B0A0",
        accent: "#241f1a",
        "accent-foreground": "#f5f0e6",
        destructive: "#e5484d",
        "destructive-foreground": "#fff5f5",
        border: "rgba(240, 216, 156, 0.16)",
        input: "rgba(240, 216, 156, 0.2)",
        ring: "#F0D89C",
        chart: {
          1: "#F0D89C",
          2: "#B08D5A",
          3: "#8a6d45",
          4: "#FCE4B8",
          5: "#6b5638",
        },
        sidebar: {
          DEFAULT: "#0f0d0b",
          foreground: "#f0e9d8",
          primary: "#F0D89C",
          "primary-foreground": "#1a1208",
          accent: "#1c1917",
          "accent-foreground": "#f5f0e6",
          border: "rgba(240, 216, 156, 0.14)",
          ring: "#F0D89C",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
