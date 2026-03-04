/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 배경
        'sudoku-bg': '#f8fafc',
        'grid-bg': '#ffffff',

        // 셀 하이라이트
        'cell-selected': '#bfdbfe',
        'cell-related': '#f1f5f9',
        'cell-samenumber': '#dbeafe',
        'cell-error': '#fee2e2',

        // 텍스트
        'number-given': '#1e293b',
        'number-input': '#2563eb',
        'number-error': '#dc2626',
        'number-note': '#94a3b8',

        // 테두리
        'border-box': '#334155',
        'border-cell': '#cbd5e1',
      },
    },
  },
  plugins: [],
}
