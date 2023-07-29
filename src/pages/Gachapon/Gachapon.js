import App from './Gachapon.vue';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import dynamicMount from '../../utils/authentication/authAccessControl.js';
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = await dynamicMount(App);

const vuetify = createVuetify({
    components,
    directives,
  })
  
app.use(vuetify);

app.mount('#app');
