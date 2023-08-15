import { createApp } from "vue";
import App from "./About.vue";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import GlobalComponentsPlugin from "../../utils/general/globalComponent.js";

const app = createApp(App);
app.use(GlobalComponentsPlugin);
app.mount("#app");
