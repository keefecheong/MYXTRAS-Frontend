<template>
    <h1>Your Feed</h1>
    <hr/>
    <BlogLayout v-for="blog in blogs" :blog="blog" />
</template>

<script>
import BlogLayout from '../components/BlogLayout.vue';

export default {
    data() {
        return {
            blogs: ''
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
                method: 'GET'
            }).then(async (res) => {
                await res.json().then((data) => {
                    console.log(data[0]);
                    this.blogs = data;
                });
            }).catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>