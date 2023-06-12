import App from './Chat.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import dynamicMount from '../../utils/authAccessControl.js';

// control access to allow only authenticated users
const app = await dynamicMount(App);
app.mount('#app');