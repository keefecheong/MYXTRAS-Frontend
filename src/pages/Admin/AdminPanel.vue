<template>
    <div class="main-container">
        <NavSidebar/>
        <div class="main-content">
            <SearchBar currentPage="admin"/>
            <div class="admin-container">
                
            </div>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../components/admin/adminNavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    }
}
</script>

<style>
@import url('../../styles/main.css');

</style>