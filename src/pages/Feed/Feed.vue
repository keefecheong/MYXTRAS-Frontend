<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Following</h1>
            <br>
            <div class="container">
                <div class="row">
                    <Blog/>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
@import url('../../styles/main.css');

</style>

<script>
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';
import Blog from '../../components/Blog.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
        Blog
    },
}
</script>