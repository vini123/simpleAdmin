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
    extend: {
      animation: {
        'piece-in': 'piece-in 0.6s ease-in 1'
      },
      keyframes: {
        'piece-in': {
          from: {
            transform: 'translateY(-12%);opacity:0;'
          },
          to: {
            transform: 'translateY(0%);opacity:1;'
          }
        }
      }
    },
  },
  plugins: [],
}