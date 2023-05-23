import { createApp } from 'vue'
import App from './Feed.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import router from '../../router/FeedRouter.js'

const app = createApp(App);

app.use(router).mount('#app');
