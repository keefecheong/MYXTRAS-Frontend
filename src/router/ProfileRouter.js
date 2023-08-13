import { createRouter, createWebHistory } from "vue-router";
import ProfilePageView from "../views/profile/ProfilePageView.vue";
import ProfilePageSupportView from "../views/profile/ProfilePageSupportView.vue";

const routes = [
    {
        path: "/",
        component: ProfilePageView,
    },
    {
        path: "/support",
        name: "support",
        component: ProfilePageSupportView,
    },
];

const router = createRouter({
    history: createWebHistory("/profilePage.html"),
    routes,
});

export default router;
