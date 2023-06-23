<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
    <NavSidebar />
    <div id="main-content" v-if="contentLoaded" >
        <div class="row">
            <ForumViewHeader
                :forum="forum"
                :isCreator="isCreator"
                :isSubscribed="isSubscribed"
                :showCreateThreadButton="true"
                @show-forum-form="() => toggleForumForm(true)"
                @show-thread-form="() => toggleThreadForm(true)"
                @subscribe="subscribeForum"
            />
            
            <div id="threads-container">
                <div id="thread-content">
                    <div class="card shadow" id="no-threads" v-if="threads.length === 0">
                        <p>No threads found, <span id="noThreadCreateBtn" @click="() => toggleThreadForm(true)">create</span> one?</p>
                    </div>

                    <div>
                        <ThreadLayout v-for="(thread, index) in threads" :thread="thread" :key="index" />
                    </div>
                </div>

                <div id="recommended-forums">
                    <RecommendedForums />
                </div>
            </div>
        </div>

        <ForumFormLayout v-if="showForumForm" :editMode="true" :forum="forum" @close-forum-form="() => toggleForumForm(false)" />
        <ThreadFormLayout v-if="showThreadForm" :editMode="false" :forumID="forum._id" @close-thread-form="() => toggleThreadForm(false)" />
    </div>
</div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import ThreadLayout from '../../components/forum/ThreadLayout.vue';
import RecommendedForums from '../../components/forum/RecommendedForums.vue';
import ForumFormLayout from '../../components/forum/ForumFormLayout.vue';
import ForumViewHeader from '../../components/forum/ForumViewHeader.vue';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import ThreadFormLayout from '../../components/forum/ThreadFormLayout.vue';

export default {
    components: {
        NavSidebar,
        ThreadLayout,
        RecommendedForums,
        ForumFormLayout,
        ForumViewHeader,
        AlertPrompt,
        ThreadFormLayout
    },

    data() {
        return {
            showForumForm: false,
            showThreadForm: false,
            alertStore: useAlertStore(),

            forum: {},
            contentLoaded: false,
            isCreator: false,
            isSubscribed: false,
            threads: [],
        }
    },
    created() {
        this.getForumPage()
    },
    watch: {
        'forum._id': {
            immediate: false,
            handler(newVal, oldVal) {
                this.getThreads();
            }
        },
    },
    methods: {
        // toggle forum form for editing
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        // toggle thread form for creating
        toggleThreadForm(show) {
            this.showThreadForm = show;
        },
        async getForumPage() {
            this.forumID = sessionStorage.getItem('forumID');

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-forum/${this.forumID}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    console.log('An error occured');
                }
            })
            .then(data => {
                this.forum = data.forum;
                this.isCreator = data.isCreator;
                this.isSubscribed = data.isSubscribed;
                this.contentLoaded = true
            })
            .catch((error) => {
                console.log(error);
            });
            
        },
        async getThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-threads/${this.forum._id}`, {
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
                this.threads = data;
            })
            .catch((error) => {
                console.log("The threads could not be loaded: ", error);
            });
        },
        subscribeForum(){
            this.isSubscribed = true
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/subscribe-forum/${this.forum._id}`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    console.log('An error occurred.');
                }
            })
            .then(data => {   
                this.isSubscribed = data.isSubscribed

                if (this.isSubscribed){
                    this.forum.subscribers.push(data.userId);
                }
                else{
                    const index = this.forum.subscribers.indexOf(data.userId);
                    this.forum.subscribers.splice(index, 1);
                }
            })
            .catch((error) => {
                console.log("Unable to subscribe to forum: ", error);
            });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
    },
    computed: {
        // get number of subscribers
        numOfSubs() {
            return this.forum.subscribers.length;
        },
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

#noThreadCreateBtn {
    color: blue;
    cursor: pointer;
}
#noThreadCreateBtn:hover {
    color: var(--primary);
}

#threads-container{
    background-color: #fefefe;
    height: 100%;
    width: 100%;
    padding: 40px 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

#thread-content {
    flex: 0 0 65%;
}

#recommended-forums {
    flex: 0 0 30%;
}

#no-threads {
    padding: 40px;
    text-align: center;
}
</style>