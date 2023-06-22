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
                   <SubscribedForums v-on:subbedForums="retrieveRecentThreads"/>
                </div>
            
                <div class="col-md-6">
                    <div class="row">
                        <div class="card shadow" v-if="subbedForums.length === 0">
                            <div class="center-align" style="margin: 3vh 0;">
                                <p>No new threads, <a href="/explore.html">Xplore</a> now!</p>
                            </div>
                        </div>
                        <ForumLayout :forums="subbedForums" style="margin: 3vh 0;"/>
                    </div>
                </div>

                <div class="col-md-3">
                    <PopularThreads/>
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

export default {
    components: {
        NavSidebar,
        ForumLayout,
        SearchBar,
        CreatedForums,
        SubscribedForums,
        PopularThreads,
        AlertPrompt,
        ForumFormLayout
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
            subbedForumThreads: []
        }
    },
    methods: {
        // toggle forum form
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        retrieveRecentThreads(variable) {
            this.subbedForums = variable;
            console.log(this.subbedForums.length)
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
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