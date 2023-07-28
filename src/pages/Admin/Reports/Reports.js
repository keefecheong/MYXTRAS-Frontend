import App from './Reports.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
// import router from '../../../router/ReportsRouter.js';
import dynamicMount from '../../../utils/authentication/authAccessControl.js';
import { createPinia } from 'pinia';

const app = await dynamicMount(App, false, true);

// app.use(router).mount('#app');
app.use(createPinia()).mount('#app');