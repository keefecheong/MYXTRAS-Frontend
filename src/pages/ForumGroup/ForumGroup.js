import { createApp } from 'vue'
import App from './ForumGroup.vue'
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia()).mount('#app');
