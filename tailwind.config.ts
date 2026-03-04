import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDFBF7",
        "cream-alt": "#F5F0E8",
        charcoal: "#1A1A1A",
        muted: "#5C5C5C",
        accent: "#C84B31",
        "accent-dark": "#A33D27",
        sage: "#2D6A4F",
        border: "#E5DFD3",
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        dm: ["var(--font-dm)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
