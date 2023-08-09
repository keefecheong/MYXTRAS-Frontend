<template>
    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt v-if="showConfirm && confirmMsg.length > 0" @close-confirm="closeConfirm">
        {{ confirmMsg }}
    </ConfirmPrompt>

    <div id="main-container">
        <NavSidebar/>
        
        <div id="main-content">
            <SearchBar />
            
            <div id="feed-container">
                <h1 id="feed-header">Your Feed</h1>

                <hr id="top-line"/>
                
                <div v-if="blogs.length <= 0" class="no-more-blogs">
                    <p>No new activity.</p>
                    <p>Follow more people? <a href="/explore.html">Explore!</a></p>
                </div>

                <div v-else id="blog-layout-container">
                    <BlogLayout v-for="blog in blogs" :key="blog._id" :blog="blog" />

                    <hr />
                
                    <div class="no-more-blogs">
                        <p>That's the end. You're all catched up!</p>
                        <p>Follow more people? <a href="/explore.html">Explore!</a></p>
                    </div>
                </div>
            </div>
            <Pets/>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');

#blog-layout-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh; /* Adjust this value based on your design */
}
#blog-layout-container::-webkit-scrollbar-track {
  background-color: #ffffff; /* Color of the scrollbar track */
}

#blog-layout-container::-webkit-scrollbar-thumb {
  background-color: #c9c9c9c4; /* Color of the scrollbar thumb */
  border-radius: 6px; /* Rounded corners for the thumb */
}
.blog-container{
  scroll-snap-align: center;
  width: 80%;
  height: 80%;
}
.blog-item {
    justify-content: center;
    text-align: center;
    align-items: center;
}
.blog-image {
    width: 60%;
    margin: auto;
}
#feed-container {
    margin: auto;
    width: clamp(350px, 50%, 1000px);
}

.no-more-blogs {
    text-align: center;
    margin-bottom: 40px;
}

#feed-header {
    text-align: center;
    font-weight: bolder !important;
    color: #E53A73 !important;
    margin-top: 20px;
}

#top-line {
    margin-bottom: 30px !important;
}
</style>

<script>
import SearchBar from '../../components/general/SearchBar.vue';
import BlogLayout from '../../components/blog/BlogLayout.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import ConfirmPrompt from '../../components/general/ConfirmPrompt.vue';

export default {
    data() {
        return {
            blogs: [],
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore()
        }
    },
    components: {
        SearchBar,
        BlogLayout,
        AlertPrompt,
        ConfirmPrompt
    },
    created() {
        // populate blog data once created
        this.getPosts();
    },
    methods: {
        // method to get blog data
        async getPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/following`, {
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
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // to close confirm prompt
        closeConfirm(decision) {
            this.confirmStore.closeConfirm(decision);
        }
    },
    computed: {
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        },
        // to get showConfirm value
        showConfirm() {
            return this.confirmStore.showConfirm;
        },
        // to get confirmMsg value
        confirmMsg() {
            return this.confirmStore.confirmMsg;
        }
    }
}
</script>