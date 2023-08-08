// import { createApp } from 'vue';
import Pets from '../../components/gamification/pets.vue';
import NavSidebar from '../../components/general/NavSidebar.vue';

const GlobalComponentsPlugin = {
        install(app) {
          app.component('Pets', Pets);
          app.component('NavSidebar', NavSidebar);
        }
    };

export default GlobalComponentsPlugin;