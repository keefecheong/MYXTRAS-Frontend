import { createApp } from 'vue'
import App from './Login.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { createPinia } from 'pinia';
import firebase from "firebase";
const app = createApp(App);
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
app.use(createPinia()).mount('#app');
