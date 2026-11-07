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
        // Stitch AI Design System Tokens
        primary: {
          DEFAULT: "#070b0e",
          container: "#1e2225",
          fixed: "#e0e3e7",
          "fixed-dim": "#c4c7cb",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#86898d",
          fixed: "#181c1f",
          "fixed-variant": "#43474b",
        },
        secondary: {
          DEFAULT: "#855224",
          container: "#ffbb84",
          fixed: "#ffdcc3",
          "fixed-dim": "#fcb881",
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#7a491b",
          fixed: "#2e1500",
          "fixed-variant": "#693b0f",
        },
        tertiary: {
          DEFAULT: "#000d08",
          container: "#00271c",
          fixed: "#b0f0d7",
          "fixed-dim": "#95d3bb",
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#58947f",
          fixed: "#002117",
          "fixed-variant": "#0c503e",
        },
        surface: {
          DEFAULT: "#fbf9f5",
          dim: "#dbdad6",
          bright: "#fbf9f5",
          tint: "#5b5f62",
          variant: "#e4e2de",
          container: {
            lowest: "#ffffff",
            low: "#f5f3ef",
            DEFAULT: "#efeeea",
            high: "#eae8e4",
            highest: "#e4e2de",
          },
        },
        "on-surface": {
          DEFAULT: "#1b1c1a",
          variant: "#44474a",
        },
        "inverse-surface": "#30312e",
        "inverse-on-surface": "#f2f0ec",
        "inverse-primary": "#c4c7cb",
        outline: {
          DEFAULT: "#75777a",
          variant: "#c4c7ca",
        },
        background: "#fbf9f5",
        "on-background": "#1b1c1a",

        // Custom Brand Tokens
        charcoal: {
          DEFAULT: "#1E2225",
          primary: "#1E2225",
          700: "#2B3033",
          800: "#1E2225",
          900: "#141719",
        },
        bronze: {
          DEFAULT: "#B87D4B",
          walnut: "#B87D4B",
          accent: "#B87D4B",
          700: "#865430",
        },
        emerald: {
          DEFAULT: "#1F5E4B",
          cta: "#1F5E4B",
          800: "#164638",
        },
        alabaster: {
          DEFAULT: "#F8F6F2",
          bg: "#F8F6F2",
        },
      },
      fontSize: {
        display: ["56px", { lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["36px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg": ["40px", { lineHeight: "54px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "38px", letterSpacing: "0em", fontWeight: "600" }],
        "headline-md": ["28px", { lineHeight: "38px", fontWeight: "600" }],
        "headline-sm": ["22px", { lineHeight: "32px", fontWeight: "600" }],
        title: ["18px", { lineHeight: "26px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "26px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "label-lg": ["15px", { lineHeight: "22px", fontWeight: "600" }],
        "label-md": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "600" }],
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
