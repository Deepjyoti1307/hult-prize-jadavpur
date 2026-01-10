import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        skeleton: "var(--skeleton)",
        border: "var(--btn-border)",
        input: "var(--input)",
        // Primary: Deep Indigo / Midnight Blue - Trust, safety, professionalism
        primary: {
          DEFAULT: "#1E3A5F",
          light: "#2A4A73",
          dark: "#152C4A",
        },
        // Secondary: Warm Sand / Soft Beige - Human, artistic warmth
        secondary: {
          DEFAULT: "#F5EFE6",
          light: "#FAF8F5",
          dark: "#E8DFD1",
        },
        // Accent: Emerald / Teal - Growth, success, confirmation
        accent: {
          DEFAULT: "#2D8B7A",
          light: "#3AA08C",
          dark: "#237566",
        },
        // Alert: Muted Red - Warnings only
        alert: {
          DEFAULT: "#C75050",
          light: "#D66666",
          dark: "#A84040",
        },
        // Text colors
        text: {
          primary: "#1A1A2E",
          secondary: "#6B6B7B",
          light: "#9B9BAB",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
      },
      boxShadow: {
        "soft": "0 4px 20px rgba(30, 58, 95, 0.08)",
        "soft-lg": "0 8px 40px rgba(30, 58, 95, 0.12)",
        "soft-xl": "0 12px 60px rgba(30, 58, 95, 0.15)",
        input: [
          "0px 2px 3px -1px rgba(0, 0, 0, 0.1)",
          "0px 1px 0px 0px rgba(25, 28, 33, 0.02)",
          "0px 0px 0px 1px rgba(25, 28, 33, 0.08)",
        ].join(", "),
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
