import { createApp } from 'vue'
import App from './ProfilePage.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import router from '../../router/CreateBlogRouter.js';
import { createPinia } from 'pinia';
const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
