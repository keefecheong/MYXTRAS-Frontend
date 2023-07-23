import { createApp } from 'vue'
import App from './Reports.vue'
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import router from '../../../router/ReportsRouter.js';

const app = createApp(App);

app.use(router).mount('#app');