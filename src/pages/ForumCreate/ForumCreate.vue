<template>

<div id="main-container">
    <NavSidebar />
    <div id="main-content">
        <p>Create forum</p>
    </div>
    
</div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
    },

    data() {
        return {
        }
  },
}
</script>

<style>

body{
    overflow-x: hidden;
}

</style>