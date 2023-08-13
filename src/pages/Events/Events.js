import { createApp } from "vue";
import App from "./Events.vue";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import GlobalComponentsPlugin from "../../utils/general/globalComponenet.js";

const app = createApp(App);
app.use(GlobalComponentsPlugin);

app.mount("#app");
