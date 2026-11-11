/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      ssm: "400px",

      smm: "500px",

      sm: "640px",

      md: "775px",

      lg: "998px",

      xl: "1280px",

      "1.5xl": "1400px",

      "2xl": "1500px",

      "3xl": "1600px",

      "4xl": "1700px",

      "5xl": "1800px",
    },
    fontFamily: {
      proximaNova: ["var(--font-proxima)", "sans-serif"],
      sourceCodePro: ["var(--font-source-code-pro)", "monospace"],
      boing: ["var(--font-boing)", "sans-serif"],
      graphik: ["var(--font-graphik)", "sans-serif"],
      workSans: ["var(--font-work-sans)", "sans-serif"],
    },
    extend: {
      // shadcn/ui design tokens (values live in styles/globals.css).
      // shadcn's `card` colour is named `surface` here, because `bg-card` is
      // already the card background image below. Use `bg-surface` in components
      // added with the shadcn CLI instead of `bg-card`.
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
      },
      backgroundImage: {
        "review-bg": "url('../public/assets/images/bg-section.png')",
        "footer-bg": "url('../public/assets/images/footer-background.png')",
        "auth-bg": "url('../public/assets/images/circle.svg')",
        "plan-bg": "url('../public/assets/images/plan-background.png')",
        "plan-bg-2": "url('../public/assets/images/plan-background-2.png')",
        "access-bg": "url('../public/assets/images/access-bg.svg')",
        "ballot-header": "url('../public/assets/images/most-beautiful.jpeg')",
        card: "url('../public/assets/images/cardbg.png')",
      },
    },
  },
  plugins: [],
};
