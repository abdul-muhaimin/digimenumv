/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["media"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        'roboto-slab': ['"Roboto Slab"', 'serif'],
        'bellota': ['"Bellota"', 'cursive'],

      },
      colors: {
        brandWhite: '#F5F5F5',
        brandBlack: '#333333',
        brandOrange: '#FF8400',
        lightBrandOrange: '#FFB84D',
        brandLightOrange: 'rgba(255, 184, 77, 0.28)',
        brandGray: '#CCCCCC',
        brandDarkGray: '#777777',

      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}