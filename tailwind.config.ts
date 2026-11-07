import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#1E2225",
          primary: "#1E2225",
          50: "#F4F5F5",
          100: "#E5E7E8",
          200: "#C7CCCE",
          300: "#9DA5A8",
          400: "#6B757A",
          500: "#495155",
          600: "#373D41",
          700: "#2B3033",
          800: "#1E2225",
          950: "#0F1113",
        },
        bronze: {
          DEFAULT: "#B87D4B",
          walnut: "#B87D4B",
          accent: "#B87D4B",
          50: "#FAF6F2",
          100: "#F4ECE4",
          200: "#E8D8C7",
          300: "#D6BC9E",
          400: "#C79C71",
          500: "#B87D4B",
          600: "#A46B3C",
          700: "#865430",
          800: "#6C442A",
          900: "#583824",
        },
        emerald: {
          DEFAULT: "#1F5E4B",
          cta: "#1F5E4B",
          50: "#F1F8F5",
          100: "#DDF0E8",
          200: "#BDE2D4",
          300: "#8FCEB7",
          400: "#5AB394",
          500: "#339474",
          600: "#24775D",
          700: "#1F5E4B",
          800: "#1B4D3F",
          900: "#184035",
          950: "#0B241E",
        },
        alabaster: {
          DEFAULT: "#F8F6F2",
          bg: "#F8F6F2",
          50: "#FCFAF8",
          100: "#F8F6F2",
          200: "#EFECE5",
          300: "#E2DDD2",
          400: "#CFC7B7",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
        readex: ["var(--font-readex-pro)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
