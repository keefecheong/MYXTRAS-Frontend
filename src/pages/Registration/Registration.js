import { createApp } from "vue";
import App from "./Registration.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { createPinia } from "pinia";

import firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    appId: process.env.FIREBASE_APPID,
};
firebase.initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia()).mount("#app");
