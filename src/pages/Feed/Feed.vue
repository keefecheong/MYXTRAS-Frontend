<template>
    <div id="main-container">
        <NavSidebar/>
        
        <SearchBar currentPage="feed"/>
        <div id="main-content">
            <br>
            <div class="feed-container container-fluid">
                <div class="row">
                    <div class="feed-content justify-content-center">
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
    max-width: 50%;
    margin-top: 20px;
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