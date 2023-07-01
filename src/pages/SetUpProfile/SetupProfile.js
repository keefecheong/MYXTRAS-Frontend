import { createApp } from 'vue';
import App from './SetupProfile.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import { createPinia } from 'pinia';

import dynamicMount from '../../utils/authentication/authAccessControl';

const vuetify = createVuetify({
    components,
    directives,
  })

const app = await dynamicMount(App);

app.use(createPinia()).use(vuetify).mount('#app');
