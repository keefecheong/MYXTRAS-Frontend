import App from './Events.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import dynamicMount from '../../../utils/authentication/authAccessControl.js';

const app = await dynamicMount(App, false, true);

app.mount('#app');