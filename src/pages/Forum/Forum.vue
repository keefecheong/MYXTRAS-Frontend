<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="forums" @show-forum-form="() => toggleForumForm(true)" />
            
            <h1 id="forum-header">Latest Updates!</h1>
            <div class="row">
                <div class="col-md-3">
                   <CreatedForums />
                   <SubscribedForums />
                </div>
            
                <div class="col-md-6">
                    <div class="row" v-if="!showDetailedThread">
                        <div class="card shadow" v-if="recentThreads.length === 0">
                            <div class="center-align" style="margin: 3vh 0;">
                                <p>No new threads, <a href="/explore.html">Xplore</a> now!</p>
                            </div>
                        </div>
                        <div>
                            <ForumLayout v-if="recentThreads.length !== 0" :recentThreads="recentThreads" style="margin: 3vh 0;"/>
                        </div>
                    </div>

                    <div class="row" v-else>
                        <ThreadDetailedLayout :thread="selectedPopularThread" />
                    </div>
                </div>

                <div class="col-md-3">
                    <PopularThreads @show-thread="(thread) => toggleDetailedThread(true, thread)" />
                </div>
            </div>
            
            <ForumFormLayout v-if="showForumForm" @close-forum-form="() => toggleForumForm(false)" />
        </div>
    </div>

</template>

<style scoped>
@import url('../../styles/main.css');

#forum-header {
    margin-top: 20px;
}

.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
}

.line {
    margin: 2em !important;
    border-top: 1px solid black;
}

#meta {
    font-size: small;
}


#threadGroupPic {
    overflow: hidden;
    float:left;
    width: 10vh;
    height: 10vh;
    margin-top: 15px;
    border-radius: 50%;
}
#thread-title {
    font-weight: bolder;
    font-size: larger;
}
#commentsText {
    margin: 1em 0 0.5em 0;
    text-decoration: none;
    color: gray !important;
}

.popularThreadContainer {
    display: flex;
    flex-direction: column;
}
.align-center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2em;
}
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import ForumLayout from '../../components/forum/ForumLayout.vue';
import SubscribedForums from '../../components/forum/SubscribedForums.vue';
import CreatedForums from '../../components/forum/CreatedForums.vue';
import PopularThreads from '../../components/forum/PopularThreads.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import ForumFormLayout from '../../components/forum/ForumFormLayout.vue';
import ThreadDetailedLayout from '../../components/forum/ThreadDetailedLayout.vue';

export default {
    components: {
        NavSidebar,
        ForumLayout,
        SearchBar,
        CreatedForums,
        SubscribedForums,
        PopularThreads,
        AlertPrompt,
        ForumFormLayout,
        ThreadDetailedLayout
    },
    data() {
        return {
            // Misc
            isDraggable: false,
            showForumForm: false,
            alertStore: useAlertStore(),
            alert: useAlertStore().alert,
            tags: [],
            // Data to display
            subbedForums: [],
            createdForums: [],
            threads: [],
            recentThreads: [],
            selectedPopularThread: null,
            showDetailedThread: false
        }
    },
    created() {
        this.retrieveRecentThreads()
    },
    methods: {
        // toggle forum form
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        async retrieveRecentThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-recent-threads/`, {
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
                this.recentThreads = data;
            })
            .catch((error) => {
                console.log("The recent threads could not be loaded: ", error);
            });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // show detailed view of popular thread
        toggleDetailedThread(show, thread) {
            if (thread) {
                this.selectedPopularThread = thread;
            }
            else {
                this.selectedPopularThread = null;
            }

            this.showDetailedThread = show;
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
        }
    }
}
</script>