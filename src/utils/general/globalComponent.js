// import { createApp } from 'vue';
import Pets from "../../components/gamification/pets.vue";
import NavSidebar from "../../components/general/NavSidebar.vue";
import Searchbar from "../../components/general/SearchBar.vue";

const GlobalComponentsPlugin = {
    install(app) {
        app.component("Pets", Pets);
        app.component("NavSidebar", NavSidebar);
        app.component("SearchBar", Searchbar);
    },
};

export default GlobalComponentsPlugin;
