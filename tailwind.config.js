/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./src/**/*.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}