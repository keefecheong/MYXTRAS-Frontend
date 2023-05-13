<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="flex flex-wrap my-15 justify-center pink-header-search"> 
                <input class="search-bar" type="text" placeholder="search">
            </div>
            <h1>test</h1>
            <p>this is a test</p>
            



        </div>
    </div>

</template>
<style>
@import url('../../styles/main.css');
</style>
<script>
import NavSidebar from '../../components/NavSidebar.vue';

export default {
    components: {
        NavSidebar
    }
}
</script>