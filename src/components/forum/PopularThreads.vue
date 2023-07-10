<template>
    <div class="card shadow">
        <div class="card-body card-position">
            <h5 class="card-title">Popular Threads</h5>
            <p v-if="popularThreads.length === 0">No popular threads found!</p>

            <div v-else id="popular-thread-container">
                <div v-for="thread in popularThreads" class="popular-thread-layout" @click="viewThread(thread)">
                    <h5 class="thread_title">{{ thread.title }}</h5>

                    <div class="imageContainer" v-if="thread.content_link">
                        <img id="popThreadPic" :src="thread.content_link" :draggable="false">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped> 
.card {
    padding: 1em 0 1em 0;
    min-height: 50vh;
    border-radius: 15px;
}
p {
    margin-top: 10vh;
    text-align: center;
}
#popular-thread-container {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    padding: 15px;
}

.popular-thread-layout {
    cursor: pointer;
    border-bottom: 1px solid lightgray;
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
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/popular`, {
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
