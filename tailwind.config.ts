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
        "suzuha-teal": {
          DEFAULT: "#0CB8AB",
          50: "#F3FBFB",
          100: "#E7F8F7",
          200: "#C2EDEA",
          300: "#9EE3DD",
          400: "#55CDC4",
          500: "#0CB8AB",
          600: "#0BA69A",
          700: "#076E67",
          800: "#05534D",
          900: "#043733",
        },
        "bianchi-teal": {
          DEFAULT: "#66CCC7",
          50: "#F7FCFC",
          100: "#F0FAF9",
          200: "#D9F2F1",
          300: "#C2EBE9",
          400: "#94DBD8",
          500: "#66CCC7",
          600: "#5CB8B3",
          700: "#3D7A77",
          800: "#2E5C5A",
          900: "#1F3D3C",
        },
        "suzuha-pink": {
          DEFAULT: "#FF478A",
          50: "#FFF6F9",
          100: "#FFEDF3",
          200: "#FFD1E2",
          300: "#FFB5D0",
          400: "#FF7EAD",
          500: "#FF478A",
          600: "#E6407C",
          700: "#992B53",
          800: "#73203E",
          900: "#4D1529",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
