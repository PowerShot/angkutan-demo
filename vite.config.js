import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base : le dépôt est publié sur GitHub Pages sous /angkutan-demo/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/angkutan-demo/',
  plugins: [react(), tailwindcss()],
})
