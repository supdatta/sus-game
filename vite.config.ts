import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This is the crucial line to add for GitHub Pages
  base: '/sus-game/',
  
  plugins: [react()],
})
