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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            div: {
              width: "100%",
            },
            h1: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "2.25rem",
              marginBottom: "1rem",
            },
            h2: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.875rem",
              marginBottom: "1rem",
            },
            h3: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            },
            h4: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.25rem",
              marginBottom: "1rem",
            },
            h5: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.125rem",
              marginBottom: "1rem",
            },
            h6: {
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              marginBottom: "1rem",
            },
            p: {
              marginBottom: "1rem",
            },
            strong: {
              color: "#fff",
            },
            em: {
              color: "#fff",
            },
            ul: {
              listStyleType: "disc",
              marginLeft: "1rem",
              marginBottom: "1rem",
            },
            ol: {
              listStyleType: "decimal",
              marginLeft: "1rem",
              marginBottom: "1rem",
            },
            li: {
              marginBottom: "0.5rem",
              fontWeight: "400",
            },
            blockquote: {
              fontWeight: "400",
              marginBottom: "1rem",
            },
            code: {
              fontFamily: "monospace",
              backgroundColor: "#171717",
              padding: "0.25rem 0.25rem",
              borderRadius: "0.375rem",
              marginBottom: "0.5rem",
            },
            pre: {
              backgroundColor: "#171717",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            },
            table: {
              backgroundColor: "#171717",
              marginBottom: "1rem",
            },
            thead: {
              backgroundColor: "#262626",

              fontWeight: "700",
            },
            tbody: {
              backgroundColor: "#171717",

              fontWeight: "400",
            },
            tr: {
              borderBottomWidth: "1px",
              borderColor: "#262626",
            },
            th: {
              fontWeight: "700",
              padding: "0.5rem",
              textAlign: "left",
            },
            td: {
              padding: "0.5rem",
              textAlign: "left",
            },
            img: {
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              width: "100%",
              maxWidth: "32rem",
              height: "auto",
              marginLeft: "auto",
              marginRight: "auto",
            },
            a: {
              textDecorationLine: "underline",
              color: "#0CB8AB",
              textDecorationColor: "#0CB8AB",
              textUnderlineOffset: "4px",
              textDecorationThickness: "2px",
              transitionProperty: "all",
              transitionDuration: "300ms",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                color: "#0BA69A",
              },
            },
          },
        },
      },
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
        "gray": {
          DEFAULT: "#737373",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
          border: "#333333",
          background: "#222222",
        },
        background: {
          light: "#f0f0f0",
          dark: "#0f0f0f",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
export default config;
