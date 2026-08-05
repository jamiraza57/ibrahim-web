import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(0.145 0.004 60)",
        foreground: "oklch(0.955 0.006 85)",
        "secondary-background": "oklch(0.185 0.006 65)",
        surface: "oklch(0.185 0.006 65)",
        "surface-2": "oklch(0.225 0.008 70)",
        card: "oklch(0.185 0.006 65)",
        "card-foreground": "oklch(0.955 0.006 85)",
        gold: "oklch(0.78 0.115 87)",
        "gold-soft": "oklch(0.88 0.085 90)",
        "gold-foreground": "oklch(0.16 0.01 70)",
        "dark-gold": "oklch(0.62 0.1 78)",
        "secondary-text": "oklch(0.7 0.012 80)",
        muted: "oklch(0.225 0.008 70)",
        "muted-foreground": "oklch(0.7 0.012 80)",
        accent: "oklch(0.26 0.02 80)",
        "accent-foreground": "oklch(0.955 0.006 85)",
        destructive: "oklch(0.6 0.2 25)",
        "destructive-foreground": "oklch(0.97 0.01 85)",
        border: "oklch(0.32 0.015 80 / 0.45)",
        input: "oklch(0.32 0.015 80 / 0.55)",
        ring: "oklch(0.78 0.115 87)",
        chart: {
          1: "oklch(0.78 0.115 87)",
          2: "oklch(0.65 0.09 60)",
          3: "oklch(0.55 0.06 100)",
          4: "oklch(0.86 0.07 92)",
          5: "oklch(0.45 0.04 80)",
        },
        sidebar: {
          DEFAULT: "oklch(0.165 0.006 65)",
          foreground: "oklch(0.93 0.006 85)",
          primary: "oklch(0.78 0.115 87)",
          "primary-foreground": "oklch(0.16 0.01 70)",
          accent: "oklch(0.235 0.01 72)",
          "accent-foreground": "oklch(0.955 0.006 85)",
          border: "oklch(0.32 0.015 80 / 0.4)",
          ring: "oklch(0.78 0.115 87)",
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
