<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <h1>Forum</h1>
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
export default {
    components: {
        NavSidebar,
        SearchBar
    }
}
</script>