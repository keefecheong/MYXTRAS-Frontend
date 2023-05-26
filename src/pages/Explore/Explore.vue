<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Explore</h1>
            <br>

            <div class="row">
                <div class="col-md-2 sub-navigation-container">
                    <div class="sub-navigation-links">
                        <router-link to="/blogs" class="sub-navigation">
                            <span>Blogs</span>
                        </router-link>
                        <router-link to="/threads" class="sub-navigation">
                            <span>Threads</span>
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
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';
import ForumLayout from '../../components/ForumLayout.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    }
}
</script>