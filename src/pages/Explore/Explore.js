import App from './Explore.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import router from '../../router/ExploreRouter.js';
import { createPinia } from 'pinia';
import dynamicMount from '../../utils/authentication/authAccessControl.js';

const app = await dynamicMount(App);

app.use(createPinia()).use(router).mount('#app');
