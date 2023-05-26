<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <BlogLayout/>
            <div class="blog-container container-fluid">
                <div class="row">
                    <div class="blog-nav col-2 col-md-3 align-items-center">
                        <router-link to="/">
                            <span>Feed</span>
                        </router-link>
                        |
                        <router-link to="/create">
                            <span>Create New</span>
                        </router-link>
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