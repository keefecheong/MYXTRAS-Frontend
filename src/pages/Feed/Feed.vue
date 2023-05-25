<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>

            <div class="blog-container container-fluid">
                <div class="row">
                    <div class="col-2 col-md-3 sub-navigation-container">
                        <div class="sub-navigation-links">
                            <router-link to="/" class="sub-navigation">
                                <span>Feed</span>
                            </router-link>
                            <router-link to="/create" class="sub-navigation">
                                <span>Create New</span>
                            </router-link>
                        </div>
                    </div>
                    <div class="blog-content col-10 col-md-9 justify-content-center">
                        <router-view />
                    </div>
                </div>
            </div>

            <!-- <h1>Following</h1>
            <br>
            <div class="container">
                <div class="row">
                    <BlogLayout/>
                </div>
            </div> -->
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
import BlogLayout from '../../components/BlogLayout.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
        BlogLayout
    },
}
</script>