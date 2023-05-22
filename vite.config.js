import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

require('dotenv').config();

// custom plugin to redirect / requests to /index.html
const redirectIndexPlugin = {
  name: 'redirect-index',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/') {
        req.url = '/feed.html';
      }
      next();
    })
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), redirectIndexPlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.PORT
  }
})