import App from "./Checkin.vue";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/css/bootstrap.css";
import dynamicMount from "../../utils/authentication/authAccessControl.js";
import GlobalComponentsPlugin from "../../utils/general/globalComponent.js";
import VueDragscroll from "vue-dragscroll";

const app = await dynamicMount(App);
app.use(VueDragscroll);
app.use(GlobalComponentsPlugin);
app.mount("#app");
