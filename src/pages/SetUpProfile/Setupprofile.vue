<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <input type="text" v-model="realname" placeholder="Real Name" id="name">
                    <input type="text" v-model="username" placeholder="Username" id="username">
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100vh;
    background-repeat: no-repeat;
    font-size: calc(.5em + 0.5vw) !important;
    overflow: hidden;
}
.whitebox {
    background-color: white;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 5vh !important;
    padding: 10vh 0;
}
</style>

<script>
export default {
    data() {
        return {
            realname: '',
            username: '',
        }
    },
}
</script>