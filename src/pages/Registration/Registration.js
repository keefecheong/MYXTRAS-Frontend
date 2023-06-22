import { createApp } from 'vue'
import App from './Registration.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import firebase from "firebase";
import 'firebase/auth';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { debounce } from 'lodash';
import { createPinia } from 'pinia'

const vuetify = createVuetify({
    components,
    directives,
  })

const firebaseConfig = {
    apiKey: "AIzaSyA3wBWOXGlzafi-c8fF1-hUUTYWgZDIxBY",
    authDomain: "myxtras-8890e.firebaseapp.com",
    projectId: "myxtras-8890e",
    storageBucket: "myxtras-8890e.appspot.com",
    messagingSenderId: "173109692601",
    appId: "1:173109692601:web:f7b857da50c0654e63b368",
    measurementId: "G-PJELBF5FF7"
  };  
firebase.initializeApp(firebaseConfig);

const app = createApp(App);
app.use(createPinia()).use(vuetify).mount('#app');
