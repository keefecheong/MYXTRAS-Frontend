import { createRouter, createWebHistory } from 'vue-router';
import IndividualThreadView from '../views/explore/ExploreBlogView.vue';
import AllThreadView from '../../components/forum/ThreadLayout.vue';

const routes = [
    {
        path: '/',
        component: AllThreadView
    },
    {
        path: ':/blogs',
        name: 'blogs',
        component: ExploreBlogView
    },
];

const router = createRouter({
    history: createWebHistory('/forumGroup.html'),
    routes
});

export default router;