<template>
    <div class="card shadow">
        <div class="card-body card-position">
            <h5 class="card-title">Popular Threads</h5>
            <div v-for="thread in popularThreads" class="row align-center">
                <div class="col-md-12 d-flex popularThreadContainer">
                    <p class="profilepic" @click="viewThread(thread)">{{ thread.thread_title }}</p>
                    <div class="imageContainer" @click="viewThread(thread)">
                        <img id="popThreadPic" :src="thread.content_links[0]" :draggable="false">
                    </div>
                    <br/>
                    <hr>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 export default {
    data() {
        return {
            popularThreads: {}
        }
    },
    mounted() {
        this.getPopularThreads()
    },
    methods: {
        viewThread(thread) {
            console.log(thread)
            localStorage.setItem('threadID', thread._id)
            location.href = "/threadView.html"
        },
        
        async getPopularThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-popular-threads/`, {
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
                console.log(data)
                this.popularThreads = data;
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
    }
}
</script>
