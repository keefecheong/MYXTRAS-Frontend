import App from "./Events.vue";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import "@simonwep/pickr/dist/themes/monolith.min.css"; // 'monolith' theme for color picker
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css"; // for date picker
import dynamicMount from "../../../utils/authentication/authAccessControl.js";
import { createPinia } from "pinia";

const app = await dynamicMount(App, false, true);

app.use(createPinia()).mount("#app");
