<template>
    <h1>Your Feed</h1>
    <hr/>
    <div v-if="blogs.length <= 0" class="no-more-blogs">
        <p>No new activity.</p>
        <p>Follow more people? <a href="/explore.html">Explore!</a></p>
    </div>

    <div v-else>
        <BlogLayout v-for="blog in blogs" :blog="blog" />

        <hr />
        <div class="no-more-blogs">
            <p>That's the end. You're all catched up!</p>
            <p>Follow more people? <a href="/explore.html">Explore!</a></p>
        </div>
    </div>
</template>

<script>
import BlogLayout from '../../components/blog/BlogLayout.vue';

export default {
    data() {
        return {
            blogs: []
        }
    },
    components: {
        BlogLayout
    },
    created() {
        // populate blog data once created
        this.getPosts();
    },
    methods: {
        // method to get blog data
        async getPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.blogs = data;
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style>
.no-more-blogs {
    text-align: center;
    margin-bottom: 40px;
}
</style>