import App from './Chat.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import pinia from '../../stores/store';
import dynamicMount from '../../utils/authentication/authAccessControl.js';

// control access to allow only authenticated users
const app = await dynamicMount(App);
app.use(pinia).mount('#app');