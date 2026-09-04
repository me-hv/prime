import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prime: {
          bg: "#090A0F",
          surface: "#10121A",
          card: "#151822",
          cardHover: "#1C202E",
          border: "#232838",
          borderSubtle: "#1B1F2D",
          borderHighlight: "#333A4F",
          text: "#F8FAFC",
          textSecondary: "#94A3B8",
          textMuted: "#64748B",
          gold: "#E5A93C",
          goldBright: "#FBBF24",
          goldDark: "#B47C1C",
          goldGlow: "rgba(229, 169, 60, 0.12)",
          cyan: "#38BDF8",
          purple: "#A855F7",
          emerald: "#10B981",
          rose: "#F43F5E",
          indigo: "#6366F1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "prime-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.5), 0 1px 4px -1px rgba(0, 0, 0, 0.3)",
        "prime-md": "0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(0, 0, 0, 0.4)",
        "prime-glow-gold": "0 0 25px -5px rgba(229, 169, 60, 0.25)",
        "prime-glow-card": "0 0 0 1px rgba(255, 255, 255, 0.04), 0 8px 32px -4px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
