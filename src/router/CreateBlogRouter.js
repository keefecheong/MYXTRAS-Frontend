import { createRouter, createWebHistory } from 'vue-router';
import CreateBlogView from '../views/blog/CreateBlogView.vue';
import EditBlogView from '../views/blog/EditBlogView.vue';

const routes = [
    {
        path: '/create',
        name: 'create-blog',
        component: CreateBlogView
    },
    {
        path: '/edit',
        name: 'edit-blog',
        component: EditBlogView,
        // only allow going to edit page from view feed page or refresh from edit page
        beforeEnter: (to, from, next) => {
            if (from.name != 'view-feed' && performance.navigation.type != 1) {
                next('/');
            }

            next();
        }
    },
];

const router = createRouter({
    history: createWebHistory('/profilePage.html'),
    routes
});

export default router;