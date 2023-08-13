import { createApp } from "vue";
import App from "./Registration.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { createPinia } from "pinia";

import firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
};
firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia()).mount("#app");
