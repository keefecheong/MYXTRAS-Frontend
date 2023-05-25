import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import FeedBlogView from '../views/FeedBlogView.vue';
import CreateBlogView from '../views/CreateBlogView.vue';

const routes = [
  {
    path: '/',
    name: 'Feed',
    component: FeedBlogView
  },
  {
    path: '/create',
    name: 'Create Blog',
    component: CreateBlogView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;