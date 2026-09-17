/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#090D14",
          800: "#0F141E",
          700: "#141B2B",
          600: "#1B2538",
          500: "#23324D",
        },
        line: {
          DEFAULT: "#1E2E4A",
          soft: "#16233A",
          strong: "#2A3F63",
        },
        text: {
          primary: "#E6EAF2",
          secondary: "#9AA6BE",
          muted: "#6B7A94",
          faint: "#4A5875",
        },
        accent: {
          amber: "#E8B86A",
          amberSoft: "#F0C98A",
          cyan: "#3DD2CC",
          violet: "#8B7CF8",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      maxWidth: {
        shell: "1280px",
        prose: "68ch",
      },
      boxShadow: {
        lab: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(30,46,74,0.9)",
        "lab-hover":
          "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 16px 48px -16px rgba(0,0,0,0.9), 0 0 0 1px rgba(42,63,99,0.95), 0 0 24px -8px rgba(232,184,106,0.15)",
        glow: "0 0 32px -8px rgba(61,210,204,0.5)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(rgba(30,46,74,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,46,74,0.4) 1px, transparent 1px)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
