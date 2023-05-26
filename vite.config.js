import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// custom plugin to redirect request urls
const redirectIndexPlugin = {
  name: 'redirect-index',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // set root path to feed.html and set up redirection for feed router
      if (req.url === '/' || req.url === '/feed.html/create' || req.url === '/feed.html/edit') {
        req.url = '/feed.html';
      }
      // set up redirection for explore router
      else if (req.url === '/explore.html/blogs' || req.url === '/explore.html/threads') {
        req.url = '/explore.html';
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