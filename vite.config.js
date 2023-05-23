import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// custom plugin to redirect / requests to /feed.html
const redirectIndexPlugin = {
  name: 'redirect-index',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/' || req.url === '/create') {
        req.url = '/feed.html';
      }
      next();
    })
  }
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue(), redirectIndexPlugin],
    server: {
      port: env.VITE_PORT
    }
  }
})