import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import ExploreBlogView from '../views/ExploreBlogView.vue';
import ExploreThreadView from '../views/ExploreThreadView.vue';

const routes = [
  {
    path: '/',
    redirect: '/blogs'
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: ExploreBlogView
  },
  {
    path: '/threads',
    name: 'Threads',
    component: ExploreThreadView
  }
];

const router = createRouter({
  history: createWebHistory('/explore.html'),
  routes
});

export default router;