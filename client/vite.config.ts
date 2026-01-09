import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://full-stack-dill-se.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})
