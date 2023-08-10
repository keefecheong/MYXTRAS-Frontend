import App from './Feed.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import { createPinia } from 'pinia';
import dynamicMount from '../../utils/authentication/authAccessControl.js';
import GlobalComponentsPlugin from '../../utils/general/globalComponenet.js';
import VueDragscroll from "vue-dragscroll";

const app = await dynamicMount(App);
app.use(VueDragscroll);
app.use(GlobalComponentsPlugin);

app.use(createPinia()).mount('#app');
