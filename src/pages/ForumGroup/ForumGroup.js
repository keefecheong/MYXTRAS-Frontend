import { createApp } from 'vue'
import App from './ForumGroup.vue'
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';
import router from '../../router/ForumRouter.js'

const app = createApp(App);

app.use(router).use(createPinia()).mount('#app');
