import App from './Checkin.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import dynamicMount from '../../utils/authentication/authAccessControl.js';

const app = await dynamicMount(App);

app.mount('#app');
