/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: 0 },
//           '100%': { transform: 'translateY(0)', opacity: 1 },
//         },
//       },
//       animation: {
//         slideUp: 'slideUp 0.6s ease-out', // Adjust duration and timing as needed
//       },
//     },
//   },
// }
