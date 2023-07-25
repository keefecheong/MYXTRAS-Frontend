import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// custom plugin to redirect request urls
const redirectIndexPlugin = {
    name: 'redirect-index',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            // set root path to feed.html and set up redirection for feed router
            if (req.url === '/') {
                req.url = '/feed.html';
            }
            // set up redirection for explore router
            else if (req.url === '/explore.html/blogs' || req.url === '/explore.html/threads') {
                req.url = '/explore.html';
            }
            // set up redirection for admin pages
            else if (req.url === '/admin' || req.url === '/admin/') {
                req.url = '/admin/home.html';
            }
            // redirect any 404 error to a custom error page (not working)
            else if (res.statusCode === 404) {
                req.url = '/error.html';
            }
            next();
        })
    }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [vue(), redirectIndexPlugin],
        server: {
            host: "127.0.0.1",
            port: env.VITE_PORT
        }
    }
});