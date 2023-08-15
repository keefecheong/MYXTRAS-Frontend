import App from "./Forum.vue";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import { createPinia } from "pinia";
import dynamicMount from "../../utils/authentication/authAccessControl.js";
import GlobalComponentsPlugin from "../../utils/general/globalComponent.js";

const app = await dynamicMount(App);
app.use(GlobalComponentsPlugin);

app.use(createPinia()).mount("#app");
