import { createRouter, createWebHistory } from 'vue-router';
import UserProfileView from '../pages/UserProfile/UserProfile.vue'



const routes = [
    // {
    //     path: '/',
    //     redirect: '/personal'
    // },
    // {
    //     path: '/personal',
    //     name: 'personal',
    //     component: PersonalProfileView
    // },
    {
        path: '/user/:username',
        name: 'UserProfile',
        component: UserProfileView,
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;