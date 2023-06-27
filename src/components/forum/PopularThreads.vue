<template>
    <div class="card shadow">
        <div class="card-body card-position">
            <h5 class="card-title">Popular Threads</h5>
            <p v-if="popularThreads.length === 0">No popular threads found!</p>
            <div v-for="thread in popularThreads" class="row align-center">
                <div class="col-md-12 d-flex popularThreadContainer" @click="viewThread(thread)">
                    <h5 id="thread_title">{{ thread.title }}</h5>
                    <div class="imageContainer">
                        <img id="popThreadPic" :src="thread.content_link" :draggable="false">
                    </div>
                    <br/>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped> 
#thread_title {
    margin: 2vh 0;
}
.card {
min-height: 50vh;
border-radius: 15px;
}
p {
    margin-top: 10vh;
    text-align: center;
}
.popularThreadContainer:hover{
    cursor: pointer;
}
</style>
<script>
 export default {
    data() {
        return {
            popularThreads: []
        }
    },
    mounted() {
        this.getPopularThreads()
    },
    emits: [
        'show-thread',
        'show-detailed-view',
    ],
    methods: {
        viewThread(thread) {
            this.$emit('show-thread', thread);
            this.$emit('show-detailed-view', true);
        },        
        async getPopularThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/popular`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Response not OK');
            })
            .then(data => {
                this.popularThreads = data;
                console.log()
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
    }
}
</script>
