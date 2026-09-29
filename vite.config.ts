import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/injectable-plant-design-suite/' : '/',
  optimizeDeps: {
    include: ['react-is']
  },
  build: {
    rollupOptions: {
      external: ['react-is'],
      output: {
        globals: {
          'react-is': 'reactIs'
        }
      }
    }
  }
})
