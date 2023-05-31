<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="row">
                <div class="col-md-6">
                    <h1 class="chatlist-header">Chat List</h1>
                </div>
                <div class="col-md-6">
                    <h1>asdad</h1>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/NavSidebar.vue';

export default {
    components: {
        NavSidebar
    }
}
</script>

<style>
@import url('../../styles/main.css');

.chatlist-header {
    margin: 0 -12px 0 -12px;
    padding-top: 3vh;
    padding-bottom: 3vh;
    background-color: var(--primary);
    color: white;
}
</style>