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
