import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    react(),
    crx({ 
      manifest,
      contentScripts: {
        preambleCode: false,
        injectCss: true,
      }
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/index.ts'
      }
    }
  }
})
