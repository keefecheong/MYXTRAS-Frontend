import { createApp } from 'vue';
import App from './Login.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { createPinia } from 'pinia';
import firebase from "firebase";

const app = createApp(App);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    appId: import.meta.env.VITE_FIREBASE_APPID
};
firebase.initializeApp(firebaseConfig);

app.use(createPinia()).mount('#app');