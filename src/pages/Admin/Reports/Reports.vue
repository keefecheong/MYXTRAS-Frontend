<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        <div id="main-content">
            <div id="header">
                <h1 id="title">View Reports</h1>
                <div class="report-options">
                    <RouterLink to="/blogs">
                        <h3 class="option">Blog</h3>
                    </RouterLink>
                    <RouterLink to="/chats">
                        <h3 class="option">Chat</h3>
                    </RouterLink>
                    <RouterLink to="/forums">
                        <h3 class="option">Forum</h3>
                    </RouterLink>
                </div>
            </div>
            <RouterView />
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

#header{
    flex-direction: row;
    background-color: #133B5B;
    padding: 20px 0 30px 0;
    min-height: 17vh;
    margin-left: -20px;
}

#title{
    color: white;
    text-align: center;
    border-bottom: #EDEDED 1px solid;
    width: 45%;
    margin: 0 auto 0 auto;
}

.report-options {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    color: white;
    justify-content: center;
}

.option {
    margin: 0 50px 0 50px !important;
    width: 10% !important;
    text-align: center;
}

.option:hover {
    cursor: pointer;
    border-bottom: white 1px solid;
}

</style>