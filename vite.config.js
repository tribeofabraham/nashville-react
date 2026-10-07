import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './': the built app works from any folder (tribeofabraham.com/nashville/, or a preview).
export default defineConfig({
  plugins: [react()],
  base: './',
})
