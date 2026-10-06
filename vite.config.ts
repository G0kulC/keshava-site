import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Framework code changes rarely — keep it in its own long-cached file.
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|react-router-dom|scheduler)[\/]/ },
            { name: 'motion', test: /node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/ },
          ],
        },
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
