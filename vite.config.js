import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable CSS code splitting for smaller initial bundle
    cssCodeSplit: true,
    // Configure chunk splitting for vendor libraries
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react'],
        }
      }
    },
    // Target modern browsers for smaller output
    target: 'es2020',
  }
})
