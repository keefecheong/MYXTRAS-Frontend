import { createRouter, createWebHistory } from 'vue-router';
import FeedBlogView from '../views/FeedBlogView.vue';
import CreateBlogView from '../views/CreateBlogView.vue';
import EditBlogView from '../views/EditBlogView.vue';

const routes = [
  {
    path: '/',
    name: 'view-feed',
    component: FeedBlogView
  },
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
  }
];

const router = createRouter({
  history: createWebHistory('/profilePage.html'),
  routes
});

export default router;