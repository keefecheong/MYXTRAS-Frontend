<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="feed"/>
            <br>
            <div class="feed-container container-fluid">
                <div class="row">
                    <div class="feed-content justify-content-center">
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
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');

.feed-container {
    max-width: 50%;
    margin-top: 20px;
}

.no-more-blogs {
    text-align: center;
    margin-bottom: 40px;
}
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import BlogLayout from '../../components/blog/BlogLayout.vue';

export default {
    data() {
        return {
            blogs: []
        }
    },
    components: {
        NavSidebar,
        SearchBar,
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