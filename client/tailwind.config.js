/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl-max": { max: "1535px" },
        "xl-max": { max: "1279px" },
        "lg-max": { max: "1023px" },
        "md-max": { max: "767px" },
        "sm-max": { max: "639px" },
        "xs-max": { max: "475px" },
        xs: "476px",
      },
    },
  },
  plugins: [],
}
