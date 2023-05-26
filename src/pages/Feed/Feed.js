import { createApp } from 'vue';
import App from './Feed.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import router from '../../router/FeedRouter.js';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
