<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        <div id="main-content">
            <h1 class="row pink-header">Xtra EVENTS! 🔊</h1>
            <AnnoucementLayout/>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
import AnnoucementLayout from '../../../components/announcement/AnnoucementLayout.vue';

export default {
    components: {
        NavSidebar,
        AnnoucementLayout
    }
}
</script>

<style>
@import url('../../../styles/main.css');

.pink-header {
    margin: 0 -12px 0 -12px;
    padding-top: 3vh;
    padding-bottom: 3vh;
    background-color: var(--primary);
    color: white;
    justify-content: center;
}


</style>