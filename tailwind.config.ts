import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(0.99 0.002 90)",
        foreground: "oklch(0.2 0.006 60)",
        "secondary-background": "oklch(0.96 0.004 85)",
        surface: "oklch(0.96 0.004 85)",
        "surface-2": "oklch(0.91 0.006 80)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.2 0.006 60)",
        gold: "oklch(0.7 0.13 85)",
        "gold-soft": "oklch(0.87 0.08 88)",
        "gold-foreground": "oklch(0.18 0.02 70)",
        "dark-gold": "oklch(0.52 0.11 80)",
        "secondary-text": "oklch(0.46 0.012 75)",
        muted: "oklch(0.94 0.005 85)",
        "muted-foreground": "oklch(0.46 0.012 75)",
        accent: "oklch(0.92 0.012 82)",
        "accent-foreground": "oklch(0.2 0.006 60)",
        destructive: "oklch(0.55 0.2 25)",
        "destructive-foreground": "oklch(0.98 0.01 85)",
        border: "oklch(0.82 0.012 80 / 0.6)",
        input: "oklch(0.82 0.012 80 / 0.7)",
        ring: "oklch(0.7 0.13 85)",
        chart: {
          1: "oklch(0.7 0.13 85)",
          2: "oklch(0.55 0.1 60)",
          3: "oklch(0.45 0.08 100)",
          4: "oklch(0.38 0.06 92)",
          5: "oklch(0.6 0.05 80)",
        },
        sidebar: {
          DEFAULT: "oklch(0.97 0.004 85)",
          foreground: "oklch(0.22 0.006 60)",
          primary: "oklch(0.7 0.13 85)",
          "primary-foreground": "oklch(0.18 0.02 70)",
          accent: "oklch(0.92 0.01 82)",
          "accent-foreground": "oklch(0.2 0.006 60)",
          border: "oklch(0.85 0.01 80 / 0.6)",
          ring: "oklch(0.7 0.13 85)",
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
