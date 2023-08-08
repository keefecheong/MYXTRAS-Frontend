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
            else if (req.url === '/feed' || req.url === '/feed/' || req.url === '/feed.html') {
                req.url = '/feed.html';
            }
            else if (req.url === '/chat' || req.url === '/chat/' || req.url === '/chat.html') {
                req.url = '/chat.html';
            }
            else if (req.url === '/checkin' || req.url === '/checkin/' || req.url === '/checkin.html') {
                req.url = '/checkin.html';
            }
            else if (req.url === '/events' || req.url === '/events/' || req.url === '/events.html') {
                req.url = '/events.html';
            }
            else if (req.url === '/forum' || req.url === '/forum/' || req.url === '/forum.html') {
                req.url = '/forum.html';
            }
            else if (req.url === '/forumGroup' || req.url === '/forumGroup/' || req.url === '/forumGroup.html') {
                req.url = '/forumGroup.html';
            }
            else if (req.url === '/profilePage' || req.url === '/profilePage/' || req.url === '/profilePage.html') {
                req.url = '/profilePage.html';
            }
            else if (req.url === 'profileManagement' || req.url === '/profileManagement/' || req.url === '/profileManagement.html') {
                req.url = '/profileManagement.html';
            }
            else if (req.url === '/registration' || req.url === '/registration/' || req.url === '/registration.html') {
                req.url = '/registration.html';
            }
            else if (req.url === '/setupProfile' || req.url === '/setupProfile/' || req.url === '/setupProfile.html') {
                req.url = '/setupProfile.html';
            }
            else if (req.url === '/gachapon' || req.url === '/gachapon/' || req.url === '/gachapon.html') {
                req.url = '/gachapon.html';
            }
            else if (req.url === '/login' || req.url === '/login/' || req.url === '/login.html') {
                req.url = '/login.html';
            }
            else if (req.url === '/explore' || req.url === '/explore/' || req.url === '/explore.html') {
                req.url = '/explore.html';
            }
            // set up redirection for explore router
            else if (req.url === '/explore.html/blogs' || req.url === '/explore.html/threads') {
                req.url = '/explore.html';
            }
            // set up redirection for profile page router
            else if (req.url === '/profilePage.html/support' || req.url === '/profilePage.html/') {
                req.url = '/profilePage.html';
            }
            // set up redirection for admin pages
            else if (req.url === '/admin' || req.url === '/admin/') {
                req.url = '/admin/reports.html';
            }
            else if (req.url === '/admin/reports' || req.url === '/admin/reports.html') {
                req.url = '/admin/reports.html';
            }
            else if (req.url === '/admin/manageAccounts' || req.url === '/admin/manageAccounts.html') {
                req.url = '/admin/manageAccounts.html';
            }
            else if (req.url === '/admin/events' || req.url === '/admin/events.html') {
                req.url = '/admin/events.html';
            }
            else if (req.url === '/about.html' || req.url === '/about' || req.url === '/about.html/') {
                req.url = '/about.html';
            }
            else if (req.url.endsWith('.html') || req.url.endsWith('.html/')) {
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