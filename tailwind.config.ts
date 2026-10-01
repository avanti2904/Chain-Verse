import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        clinical: {
          blue: "#0284c7",
          teal: "#0d9488",
          navy: "#0f172a",
          surface: "#f8fafc",
          border: "#e2e8f0",
          verified: "#059669",
          ai: "#6366f1",
          urgent: "#dc2626",
          warning: "#d97706",
        }
      },
    },
  },
  plugins: [],
};
export default config;
