import App from './Feed.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';
import dynamicMount from '../../utils/general/authAccessControl.js';

const app = await dynamicMount(App);

app.use(createPinia()).mount('#app');
