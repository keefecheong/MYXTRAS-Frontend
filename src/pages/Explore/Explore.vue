<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="feed"/>
            <br>
            <br>
            <h1>Explore</h1>
            <br>

            <div class="row">
                <div class="col-md-2 sub-navigation-container">
                    <div class="sub-navigation-links">
                        <router-link to="/blogs">
                            <span class="sub-navigation active" id="blogs" @click="toggleBlogs">Blogs</span>
                        </router-link>
                        <router-link to="/threads">
                            <span class="sub-navigation" id="forums" @click="toggleForums">Threads</span>
                        </router-link>
                    </div>                    
                </div>
                <div class="col-md-9">
                    <router-view />
                </div>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    },
    methods: {
        toggleBlogs() {
            document.getElementById("blogs").className += " active";
            document.getElementById("forums").className = "sub-navigation";
        },
        toggleForums() {
            document.getElementById("forums").className += " active";
            document.getElementById("blogs").className = "sub-navigation";
        }
    }
}
</script>