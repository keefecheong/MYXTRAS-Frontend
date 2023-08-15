<template>
    <AlertPrompt
        v-if="showAlert && alertMsg.length > 0"
        @close-alert="closeAlert"
    >
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt
        v-if="showConfirm && confirmMsg.length > 0"
        @close-confirm="closeConfirm"
    >
        {{ confirmMsg }}
    </ConfirmPrompt>

    <div id="main-container">
        <NavSidebar />
        <div id="main-content" v-if="contentLoaded">
            <div class="row">
                <ForumViewHeader
                    :forum="forum"
                    :showCreateThreadButton="true"
                    @show-forum-form="() => toggleForumForm(true)"
                    @show-thread-form="() => toggleThreadForm(true)"
                    @report-forum="() => toggleReportForm(true)"
                />

                <div id="threads-container">
                    <div id="recommended-forums" v-if="isMobile">
                        <RecommendedForums />
                    </div>
                    <div id="thread-content">
                        <div
                            class="card shadow"
                            id="no-threads"
                            v-if="threads.length === 0"
                        >
                            <p>
                                No threads found,
                                <span
                                    id="noThreadCreateBtn"
                                    @click="() => toggleThreadForm(true)"
                                    >create</span
                                >
                                one?
                            </p>
                        </div>

                        <div v-if="!showDetailedView">
                            <keep-alive>
                                <ThreadMiniLayout
                                    v-for="(thread, index) in threads"
                                    :key="index"
                                    :thread="thread"
                                    :index="index"
                                    :showForumDetails="false"
                                    @show-detailed-view="
                                        () => toggleDetailedView(true, index)
                                    "
                                    @deleted-thread="
                                        () => handleDeletedThread(index)
                                    "
                                />
                            </keep-alive>
                        </div>

                        <div v-if="showDetailedView">
                            <ThreadDetailedLayout
                                :thread="threads[selectedIndex]"
                                :showBackArrow="true"
                                :highlightComment="commentId"
                                :key="threads[selectedIndex]._id"
                                @close-detailed-view="
                                    () =>
                                        toggleDetailedView(false, selectedIndex)
                                "
                            />
                        </div>
                    </div>

                    <div id="recommended-forums" v-if="!isMobile">
                        <RecommendedForums />
                    </div>
                </div>
            </div>

            <ForumFormLayout
                v-if="showForumForm"
                :editMode="true"
                :forum="forum"
                @close-forum-form="() => toggleForumForm(false)"
            />
            <ThreadFormLayout
                v-if="showThreadForm"
                :editMode="false"
                :forumID="forum._id"
                @close-thread-form="() => toggleThreadForm(false)"
            />

            <ReportFormLayout
                v-if="showReportForm"
                :forumId="forum._id"
                :type="'forum'"
                @close-report-form="() => toggleReportForm(false)"
            />
            <Pets />
        </div>
    </div>
</template>

<script>
import RecommendedForums from "../../components/forum/RecommendedForums.vue";
import ForumFormLayout from "../../components/forum/ForumFormLayout.vue";
import ForumViewHeader from "../../components/forum/ForumViewHeader.vue";

import ThreadMiniLayout from "../../components/forum/ThreadMiniLayout.vue";
import ThreadDetailedLayout from "../../components/forum/ThreadDetailedLayout.vue";
import ThreadFormLayout from "../../components/forum/ThreadFormLayout.vue";

import { useAlertStore } from "../../stores/AlertStore.js";
import AlertPrompt from "../../components/general/AlertPrompt.vue";
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import ConfirmPrompt from "../../components/general/ConfirmPrompt.vue";

import ReportFormLayout from "../../components/report/ReportFormLayout.vue";

import highlightElement from "../../utils/general/highlightElement.js";

export default {
    components: {
        ThreadMiniLayout,
        RecommendedForums,
        ForumFormLayout,
        ForumViewHeader,
        AlertPrompt,
        ThreadFormLayout,
        ThreadDetailedLayout,
        ConfirmPrompt,
        ReportFormLayout,
    },

    data() {
        return {
            showForumForm: false,
            showThreadForm: false,
            showDetailedView: false,
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore(),

            forum: {},
            contentLoaded: false,
            threads: [],
            selectedIndex: null,
            commentId: null,
            scrollBack: false,

            showReportForm: false,
            isMobile: false,
        };
    },
    created() {
        this.initData().then(() => {
            const query = location.search;

            if (!query) return;

            const params = new URLSearchParams(query);

            if (!params.has("thread")) return;

            this.toggleDetailedView(true, null, params.get("thread"));

            setTimeout(() => {
                highlightElement(
                    document.getElementById("thread-detailed-layout-container"),
                );
            }, 300);

            if (params.has("comment")) {
                this.commentId = params.get("comment");
            }
        });
    },
    updated() {
        // if scrollBack is true then scroll to that thread
        if (this.scrollBack && this.selectedIndex != null) {
            if (!document.getElementById(this.selectedIndex)) {
                return;
            }

            document.getElementById(this.selectedIndex).scrollIntoView({
                block: "center",
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
            console.log("test");
        },
        // handle toggling of detailed thread view
        toggleDetailedView(show, index, id) {
            this.selectedIndex =
                index != null
                    ? index
                    : this.threads.findIndex((thread) => thread._id == id);

            if (!show) {
                this.scrollBack = true;
            }

            this.showDetailedView = show;
        },
        // toggle forum form for editing
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        // toggle thread form for creating
        toggleThreadForm(show) {
            this.showThreadForm = show;
        },
        // initialize data
        async initData() {
            this.forumID = sessionStorage.getItem("forum_id");

            // redirect back to forum.html if no forumID
            if (!this.forumID) {
                location.href = "/forum.html";
            }

            await Promise.all([this.getForumPage(), this.getThreads()]);
        },
        // to get forum details
        getForumPage() {
            return fetch(
                `${process.env.APP_SERVER_URL}/api/forums/${
                    this.forumID
                }`,
                {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                },
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        console.log("An error occured");
                    }
                })
                .then((data) => {
                    this.forum = data;
                    this.contentLoaded = true;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // to get threads
        getThreads() {
            return fetch(
                `${process.env.APP_SERVER_URL}/api/threads/forum/${
                    this.forumID
                }`,
                {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                },
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("Response not OK");
                })
                .then((data) => {
                    this.threads = data;
                })
                .catch((error) => {
                    console.log("The threads could not be loaded: ", error);
                });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        closeConfirm(decision) {
            this.confirmStore.closeConfirm(decision);
        },
        // to handle thread deletion
        handleDeletedThread(index) {
            this.threads.splice(index, 1);
        },
        // to show/hide report form
        toggleReportForm(show) {
            this.showReportForm = show;
        },
    },
    computed: {
        // get number of subscribers
        numOfSubs() {
            return this.forum.subscribers;
        },
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
    },
};
</script>

<style>
@import url("../../styles/main.css");
@import url("../../styles/forums/common-forum-styles.css");

#noThreadCreateBtn {
    color: blue;
    cursor: pointer;
}
#noThreadCreateBtn:hover {
    color: var(--primary);
}

#threads-container {
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

@media screen and (max-width: 768px) {
    #threads-container {
        padding: 0;
        flex-direction: column;
    }
    #thread-content {
        min-width: 100%;
        margin: 10vh 2vw 0 2vw;
    }
    .thread-layout-container {
        padding: 20px;
        margin: auto;
        margin-bottom: 10vh;
        max-width: 80%;
    }
    #recommended-forums {
        width: 80%;
        margin: auto;
        margin-top: 10vh;
    }
    .row {
        max-width: 100%;
        margin: 0 !important;
    }
    .report-button {
        margin-top: 16px !important;
    }
}
</style>
