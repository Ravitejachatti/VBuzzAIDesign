/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
<<<<<<< HEAD
  darkMode: false, // 👈 Add this line
=======
>>>>>>> vbuzzUpdatedFrontend/main
  theme: {
    extend: {
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '200': '200',
        '300': '300',
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
      },
<<<<<<< HEAD
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'custom-nav': '0 0 20px rgba(0, 0, 0, 0.10)',
        'custom-field': '0 0 10px rgba(0, 0, 0, 0.10)',
      },
      colors: {
        primary: "#1E5D9A",
        secondary: "#EA5C0C",
      },
    },
  },
  plugins: [],
};
=======
    },
  },
  plugins: [],
}

>>>>>>> vbuzzUpdatedFrontend/main
