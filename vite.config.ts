import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/figma-003/', // GitHub Pages: https://username.github.io/figma-003/
  publicDir: 'public',
})
