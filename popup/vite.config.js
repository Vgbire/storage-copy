import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../extension/popup',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
