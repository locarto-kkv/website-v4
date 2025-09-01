// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Brand Orange (buttons, CTAs)
        secondary: "#081b45", // Blue (links, highlights)
        background: "#d2d8e0", // Light Background (page, sections)
        accent: "#fc944f", // Light Orange (neutrals)
      },
    },
  },
  plugins: [],
};
