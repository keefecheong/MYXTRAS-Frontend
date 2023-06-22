import { createRouter, createWebHistory } from 'vue-router';
import IndividualThreadView from '../pages/ForumThread/ForumThread.vue';
import AllThreadView from '../components/forum/ThreadLayout.vue';

const routes = [
    {
        path: '/',
        component: AllThreadView
    },
    {
        path: '/thread',
        name: 'thread',
        component: IndividualThreadView
    },
];

const router = createRouter({
    history: createWebHistory('/forumGroup.html'),
    routes
});

export default router;