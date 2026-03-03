/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 게임 커스텀 색상
        'game-bg': '#1f2937',
        'game-grid': '#111827',
        'snake-head': '#15803d',
        'snake-body': '#22c55e',
        'food': '#ef4444',
      },
      spacing: {
        'cell': '2rem', // 32px (8 * 4)
      },
    },
  },
  plugins: [],
}
