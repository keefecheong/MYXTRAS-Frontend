import App from './ProfileManagement.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'cropperjs/dist/cropper.css';
import dynamicMount from '../../utils/authentication/authAccessControl.js';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

const app = await dynamicMount(App);

app.mount('#app');
