<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="feed"/>
            <br>
            <div class="feed-container container-fluid">
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
                    <div class="feed-content col-10 col-md-9 justify-content-center">
                        <router-view />
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');

.feed-container {
    max-width: 70%;
}
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    },
}
</script>