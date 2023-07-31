import App from './Checkin.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import dynamicMount from '../../utils/authentication/authAccessControl.js';
// import Pets from '../../components/gamification/pets.vue';
import GlobalComponentsPlugin from '../../utils/general/globalComponenet.js';
const app = await dynamicMount(App);
app.use(GlobalComponentsPlugin);
app.mount('#app');
