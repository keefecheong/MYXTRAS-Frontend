import App from './ProfilePage.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { createPinia } from 'pinia';
import dynamicMount from '../../utils/authentication/authAccessControl.js';
import GlobalComponentsPlugin from '../../utils/general/globalComponenet.js';

const app = await dynamicMount(App);
app.use(GlobalComponentsPlugin);

app.use(createPinia()).mount('#app');