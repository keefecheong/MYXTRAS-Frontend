<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        <div id="main-content">

        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';

export default {
    components: {
        NavSidebar,
    }
}
</script>

<style>
@import url('../../../styles/main.css');

</style>