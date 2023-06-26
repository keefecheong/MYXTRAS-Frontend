import { createApp } from 'vue'
import App from './UserProfile.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { createPinia } from 'pinia';
const app = createApp(App);

app.use(createPinia()).mount('#app');
