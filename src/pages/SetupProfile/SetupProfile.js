import App from "./SetupProfile.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { createPinia } from "pinia";

import dynamicMount from "../../utils/authentication/authAccessControl.js";

const app = await dynamicMount(App, true);

app.use(createPinia()).mount("#app");
