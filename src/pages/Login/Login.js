import { createApp } from "vue";
import App from "./Login.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { createPinia } from "pinia";
import firebase from "firebase";

const app = createApp(App);

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    appId: process.env.FIREBASE_APPID,
};
firebase.initializeApp(firebaseConfig);

app.use(createPinia()).mount("#app");
