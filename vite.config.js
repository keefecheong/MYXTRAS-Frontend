import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { promises as fs } from "fs";
import { join, resolve } from "path";

// custom plugin to redirect request urls
const redirectPlugin = {
    name: "redirect",
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            // set root path to feed.html and set up redirection for feed router
            if (req.url === "/") {
                req.url = "/feed.html";
            }
            // set up redirection for admin pages
            else if (req.url === "/admin" || req.url === "/admin/") {
                req.url = "/admin/reports.html";
            }
            // automatically give resource if not html page
            else if (!req.url.includes(".html")) {
                return next();
            }
            // set up redirection for explore router
            else if (
                req.url === "/explore.html/blogs" ||
                req.url === "/explore.html/threads"
            ) {
                req.url = "/explore.html";
            }
            // set up redirection for profile page router
            else if (
                req.url === "/profilePage.html/support" ||
                req.url === "/profilePage.html/"
            ) {
                req.url = "/profilePage.html";
            }
            // if not the above pages/routes then check if exists in file system
            else {
                const path = join(__dirname, "public/", req.url.split("?")[0]);

                try {
                    await fs.access(path, fs.F_OK);
                } catch (error) {
                    // redirect to error.html if the page does not exist
                    req.url = "/error.html";
                }
            }

            next();
        });
    },
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        define: {
            "process.env": env,
        },
        plugins: [vue(), redirectPlugin],
        server: {
            host: "0.0.0.0",
            port: env.PORT,
        },
        build: {
            target: 'esnext',
            outDir: 'dist',
            emptyOutDir: true,
            copyPublicDir: false,
            assetsDir: 'assets',
            rollupOptions: {
                input: {
                    adminEvents: resolve(__dirname, "public/admin/events.html"),
                    adminmanageAccounts: resolve(__dirname, "public/admin/manageAccounts.html"),
                    adminReports: resolve(__dirname, "public/admin/reports.html"),
                    about: resolve(__dirname, "public/about.html"),
                    chat: resolve(__dirname, "public/chat.html"),
                    checkin: resolve(__dirname, "public/checkin.html"),
                    error: resolve(__dirname, "public/error.html"),
                    events: resolve(__dirname, "public/events.html"),
                    explore: resolve(__dirname, "public/explore.html"),
                    feed: resolve(__dirname, "public/feed.html"),
                    forum: resolve(__dirname, "public/forum.html"),
                    forumGroup: resolve(__dirname, "public/forumGroup.html"),
                    gachapon: resolve(__dirname, "public/gachapon.html"),
                    login: resolve(__dirname, "public/login.html"),
                    profileManagement: resolve(__dirname, "public/profileManagement.html"),
                    profilePage: resolve(__dirname, "public/profilePage.html"),
                    registration: resolve(__dirname, "public/registration.html"),
                    setupProfile: resolve(__dirname, "public/setupProfile.html"),
                }
            }
        }
    };
});
