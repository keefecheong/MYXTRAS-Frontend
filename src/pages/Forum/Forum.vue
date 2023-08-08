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
            <SearchBar @show-forum-form="() => toggleForumForm(true)" />
            
            <h1 id="forum-header">Latest Updates!</h1>

            <div class="row" id="forum-view-container">
                <div class="col-md-3">
                   <CreatedForums />
                   <SubscribedForums />
                </div>
                <div class="col-md-3" v-if="isMobile">
                    <PopularThreads @show-thread="(thread) => toggleDetailedThread(true, null, thread)" @show-detailed-view="showForumDetails" />
                </div>
                <div class="col-md-6 forum-middle-content">
                    <div class="row" v-if="!showDetailedThread">
                        <div class="card shadow" v-if="recentThreads.length === 0">
                            <div class="center-align whiteBox">
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
                                @deleted-thread="() => handleDeletedThread(index)"
                            />
                        </div>
                    </div>

                    <div class="row" v-else style="position: relative;">
                        <ThreadDetailedLayout 
                            :key="threadToDisplay._id"
                            :thread="threadToDisplay"
                            :showBackArrow="false"
                            :showForumDetails="true"
                            @close-detailed-view="() => toggleDetailedThread(false, selectedIndex)"
                        />
                    </div>
                </div>

                <div class="col-md-3" v-if="!isMobile">
                    <PopularThreads @show-thread="(thread) => toggleDetailedThread(true, null, thread)" @show-detailed-view="showForumDetails" />
                </div>
            </div>
            
            <ForumFormLayout v-if="showForumForm" @close-forum-form="() => toggleForumForm(false)" />
        </div>
        <Pets/>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/forums/common-forum-styles.css');

#forum-header {
    color: var(--primary);
    margin-top: 20px;
}
.card {
    margin-bottom: 60px;
}
#forum-view-container {
    padding: 20px;
}
.whiteBox p {
    margin: 5vh;
    text-align: center;

}

@media screen and (max-width: 768px) {
.whiteBox {
    margin: 5vh 0;
}
}
</style>

<script>
import SearchBar from '../../components/general/SearchBar.vue';
import SubscribedForums from '../../components/forum/SubscribedForums.vue';
import CreatedForums from '../../components/forum/CreatedForums.vue';
import PopularThreads from '../../components/forum/PopularThreads.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import ForumFormLayout from '../../components/forum/ForumFormLayout.vue';
import ThreadDetailedLayout from '../../components/forum/ThreadDetailedLayout.vue';
import ThreadMiniLayout from '../../components/forum/ThreadMiniLayout.vue';
import ConfirmPrompt from '../../components/general/ConfirmPrompt.vue';

export default {
    components: {
    SearchBar,
    CreatedForums,
    SubscribedForums,
    PopularThreads,
    AlertPrompt,
    ForumFormLayout,
    ThreadDetailedLayout,
    ThreadMiniLayout,
    ConfirmPrompt
},
    data() {
        return {
            // Misc
            isDraggable: false,
            showForumForm: false,
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore(),
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
            scrollBack: false,
            isMobile: false
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
    beforeDestroy() {
        // Clean up the event listener
        window.removeEventListener("resize", this.handleResize);
    },
    mounted() {
        // Check the window width on mount and set the view accordingly
        this.isMobile = window.innerWidth <= 768;
        window.addEventListener("resize", this.handleResize);
    },
    methods: {
        handleResize() {
        // Update the view when the window width changes
            this.isMobile = window.innerWidth <= 768;
        },
        // toggle forum form
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        async retrieveRecentThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/recent`, {
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

        closeConfirm(decision){
            this.confirmStore.closeConfirm(decision);
        },
        // show detailed view of popular thread
        toggleDetailedThread(show, index, thread) {
            this.selectedPopularThread = thread;
            this.selectedIndex = index;
            if (!show && index != null) {
                this.scrollBack = true;
            }

            this.showDetailedThread = show;
        },
        // to handle thread deletion
        handleDeletedThread(index) {
            this.recentThreads.splice(index, 1);
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
        },
        // get thread to display in detailed layout
        threadToDisplay() {
            return this.selectedPopularThread || this.recentThreads[this.selectedIndex];
        }
    }
}
</script>