<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="forums" @show-forum-form="() => toggleForumForm(true)" />
            
            <h1 id="forum-header">Latest Updates!</h1>

            <div class="row" id="forum-view-container">
                <div class="col-md-3">
                   <CreatedForums />
                   <SubscribedForums />
                </div>
            
                <div class="col-md-6 forum-middle-content">
                    <div class="row" v-if="!showDetailedThread">
                        <div class="card shadow" v-if="recentThreads.length === 0">
                            <div class="center-align">
                                <p>No new threads, <a href="/explore.html">Xplore</a> now!</p>
                            </div>
                        </div>

                        <div v-if="recentThreads.length !== 0">
                            <ThreadMiniLayout 
                                v-for="(thread, index) in recentThreads"
                                :key="index" 
                                :thread="thread"
                                :index="index"
                                :showForumDetails="true"
                                @show-detailed-view="() => toggleDetailedThread(true, index)"
                            />
                        </div>
                    </div>

                    <div class="row" v-else style="position: relative;">
                        <ThreadDetailedLayout 
                            :thread="threadToDisplay"
                            :showBackArrow="false"
                            :showForumDetails="true"
                            @close-detailed-view="() => toggleDetailedThread(false, selectedIndex)" />
                    </div>
                </div>

                <div class="col-md-3">
                    <PopularThreads @show-thread="(thread) => toggleDetailedThread(true, null, thread)" @show-detailed-view="showForumDetails" />
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

#forum-view-container {
    padding: 20px;
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
import ThreadMiniLayout from '../../components/forum/ThreadMiniLayout.vue';

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
    ThreadDetailedLayout,
    ThreadMiniLayout
},
    data() {
        return {
            // Misc
            isDraggable: false,
            showForumForm: false,
            alertStore: useAlertStore(),
            alert: useAlertStore().alert,
            tags: [],
            showForumDetails: false,
            // Data to display
            subbedForums: [],
            createdForums: [],
            threads: [],
            recentThreads: [],
            selectedIndex: null,
            selectedPopularThread: null,
            showDetailedThread: false,
            scrollBack: false
        }
    },
    created() {
        this.retrieveRecentThreads()
    },
    updated() {
        // if scrollBack is true then scroll to that thread
        if (this.scrollBack && this.selectedIndex != null) {
            if (!document.getElementById(this.selectedIndex)) {
                return; 
            }

            document.getElementById(this.selectedIndex).scrollIntoView({
                block: 'center'
            });

            // set timeout to clear scrollBack
            setTimeout(() => {
                this.scrollBack = false;
            }, 500);
        }
    },
    methods: {
        // toggle forum form
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        async retrieveRecentThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/recent`, {
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
        toggleDetailedThread(show, index, thread) {
            this.selectedPopularThread = thread;
            this.selectedIndex = index;
            if (!show && index != null) {
                this.scrollBack = true;
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
        },
        // get thread to display in detailed layout
        threadToDisplay() {
            return this.selectedPopularThread || this.recentThreads[this.selectedIndex];
        }
    }
}
</script>