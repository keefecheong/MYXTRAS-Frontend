<template>
    <div id="main-container">
        <NavSidebar/>

        <div id="main-content">
            <SearchBar currentPage="xplore"/>

            <div class="container-fluid explore-container">
                <div class="row">
                    <div class="col-md-2 sub-navigation-container">
                        <div class="sub-navigation-links">
                            <router-link to="/blogs">
                                <span class="sub-navigation" :class="{'active': viewingBlogs}" @click="() => toggleViewingBlogs(true)">Blogs</span>
                            </router-link>
                            
                            <router-link to="/threads">
                                <span class="sub-navigation" :class="{'active': !viewingBlogs}" @click="() => toggleViewingBlogs(false)">Threads</span>
                            </router-link>
                        </div>                    
                    </div>

                    <div class="col-md-10">
                        <h1>Explore</h1>
                        <hr />
                        <router-view :blogs="blogs" />
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');

.explore-container {
    margin-top: 50px;
}
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

export default {
    data() {
        return {
            viewingBlogs: true,
            blogs: []
        }
    },
    components: {
        NavSidebar,
        SearchBar
    },
    created() {
        this.getPosts();
    },
    methods: {
        // method to get blog data
        async getPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/explore`, {
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
        },
        // toggle viewingBlogs to update navigation display
        toggleViewingBlogs(viewing) {
            this.viewingBlogs = viewing;
        }
    }
}
</script>