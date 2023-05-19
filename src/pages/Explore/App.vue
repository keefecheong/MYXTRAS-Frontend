<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Explore</h1>
            <br>
        </div>
    </div>

</template>
<style>
@import url('../../styles/main.css');

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