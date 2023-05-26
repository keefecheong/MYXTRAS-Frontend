import { createApp } from 'vue'
import App from './Explore.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import router from '../../router/ExploreRouter.js'

const app = createApp(App);

app.use(router).mount('#app');
