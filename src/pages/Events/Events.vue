<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <h1 class="row pink-header">Xtra EVENTS! 🔊</h1>
            <AnnoucementLayout/>
        </div>
    </div>

</template>

<script>
import AnnoucementLayout from '../../components/announcement/AnnoucementLayout.vue'; 

export default {
    components: {
        AnnoucementLayout
    }
}
</script>

<style>

.pink-header {
    margin: 0 -12px 0 -12px;
    padding-top: 3vh;
    padding-bottom: 3vh;
    background-color: var(--primary);
    color: white;
    justify-content: center;
}


</style>