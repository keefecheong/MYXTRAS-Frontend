import { createApp } from 'vue'
import App from './Registration.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

const jwt = require('jsonwebtoken');
const app = createApp(App);

app.mount('#app');
