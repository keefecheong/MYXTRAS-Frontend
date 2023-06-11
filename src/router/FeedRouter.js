import { createRouter, createWebHistory } from 'vue-router';
import FeedBlogView from '../views/blog/FeedBlogView.vue';
import CreateBlogView from '../views/blog/CreateBlogView.vue';
import EditBlogView from '../views/blog/EditBlogView.vue';
import UnauthorizedView from '../views/general/UnauthorizedView.vue';

const routes = [
  {
    path: '/',
    name: 'view-feed',
    component: FeedBlogView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create',
    name: 'create-blog',
    component: CreateBlogView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit',
    name: 'edit-blog',
    component: EditBlogView,
    meta: {
      requiresAuth: true
    },
    // only allow going to edit page from view feed page or refresh from edit page
    beforeEnter: (to, from, next) => {
      if (from.name != 'view-feed' && performance.navigation.type != 1) {
        next('/');
      }

      next();
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized-feed',
    component: UnauthorizedView,
    meta: {
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory('/feed.html'),
  routes
});

// check authentication status of user to control access to views
router.beforeEach(async (to, from) => {
  let authenticated = false;

  await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
    method: 'get',
    credentials: 'include'
  }).then((res) => {
    if (res.ok) {
      authenticated = true;
    }
  }).catch((error) => {
    console.log(error);
  });

  // if not authenticated and the target path requires authentication then redirect to unauthorized view
  if (to.meta.requiresAuth && !authenticated) {
    return {
      path: '/unauthorized'
    }
  }
  // if authenticated, if user wants to go to the unauthorized path return to default path
  else if (authenticated) {
    if (to.path == '/unauthorized') {
      return {
        path: '/'
      }
    }
  }
});

export default router;