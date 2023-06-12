import App from './Feed.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import router from '../../router/FeedRouter.js';
import { createPinia } from 'pinia';
import dynamicMount from '../../utils/general/authAccessControl.js';

const app = await dynamicMount(App);

app.use(createPinia()).use(router).mount('#app');
