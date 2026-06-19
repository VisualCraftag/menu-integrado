import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        basil: "#2f6b4f",
        citron: "#dce766",
        tomato: "#e14b3f",
        oat: "#f6f1e7",
        shell: "#fffaf1",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 27, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
