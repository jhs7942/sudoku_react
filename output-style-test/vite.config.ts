import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 설정: React와 TypeScript를 지원합니다
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  }
})
