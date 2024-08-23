const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00796b",
        'blue-gray': '#607d8b',
        'slate': '#54617a',
        'prim-blue': '#0073ff',
        'red-500': '#ff4568', // Añadimos el color para el botón
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "3xl": "0px 0px 10px #929191",
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'bariol': ['bariolregular', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'], // Añadimos la fuente Poppins
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
});