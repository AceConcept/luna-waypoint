import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Same package as `stepscreen` dep — submodule optional for local dev only */
const stepscreenPkgRoot = path.resolve(__dirname, 'node_modules/stepscreen')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      stepscreen: stepscreenPkgRoot,
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..'), stepscreenPkgRoot],
    },
  },
})
