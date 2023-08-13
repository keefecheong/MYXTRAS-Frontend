import { createRouter, createWebHistory } from "vue-router";
import ExploreBlogView from "../views/explore/ExploreBlogView.vue";
import ExploreThreadView from "../views/explore/ExploreThreadView.vue";

const routes = [
    {
        path: "/",
        redirect: "/blogs",
    },
    {
        path: "/blogs",
        name: "blogs",
        component: ExploreBlogView,
    },
    {
        path: "/threads",
        name: "threads",
        component: ExploreThreadView,
    },
];

const router = createRouter({
    history: createWebHistory("/explore.html"),
    routes,
});

export default router;
