/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22D3EE",
          light: "#38BDF8",
          dark: "#0891b2"
        },
        background: "#0B1220",
        secondaryBg: "#111827",
        card: "#172033",
        elevated: "#1E293B",
        accent: "#22D3EE",
        accentSecondary: "#38BDF8",
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textMuted: "#94A3B8",
        border: "#334155",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        critical: "#DC2626",
      },
      borderRadius: {
        'premium': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
