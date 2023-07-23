import { createRouter, createWebHistory } from 'vue-router';
import BlogReportView from '../views/reports/BlogReportView.vue';
import ChatReportView from '../views/reports/ChatReportView.vue';
import ForumReportView from '../views/reports/ForumReportView.vue';

const routes = [
    {
        path: '/',
        redirect: '/blogs'
    },
    {
        path: '/blogs',
        name: 'blogs',
        component: BlogReportView
    },
    {
        path: '/chats',
        name: 'chats',
        component: ChatReportView
    },
    {
        path: '/forums',
        name: 'forums',
        component: ForumReportView
    }
];

const router = createRouter({
    history: createWebHistory('/admin/reports.html/'),
    routes
});

export default router;