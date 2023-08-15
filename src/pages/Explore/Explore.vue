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

        <div id="main-content">
            <SearchBar />

            <div class="explore-container row">
                <div class="col-md-2 col-xs-12 sub-navigation-container">
                    <div class="sub-navigation-links">
                        <router-link to="/blogs">
                            <span class="sub-navigation">Blogs</span>
                        </router-link>

                        <router-link to="/threads">
                            <span class="sub-navigation">Threads</span>
                        </router-link>
                    </div>
                </div>

                <div class="col-md-9 col-xs-12">
                    <h1 id="xplore-h1">Explore</h1>
                    <hr />
                    <router-view :blogs="blogs" />
                </div>
            </div>
            <Pets />
        </div>
    </div>
</template>

<style>
@import url("../../styles/main.css");
@import url("../../styles/sub-navigation.css");
#xplore-h1 {
    color: var(--primary);
}
.explore-container {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    position: relative;
}
#maximized-header {
    color: white;
}
@media screen and (max-width: 768px) {
    .sub-navigation-links {
        flex-direction: row;
        margin: auto;
        text-align: center;
        align-items: center;
        justify-content: center;
        margin: 4vh 0;
        column-gap: 2vw;
        min-width: 100vw;
    }
    .sub-navigation-links > a {
        display: inline-block;
        min-width: 10vw !important;
    }
}
</style>

<script>
import SearchBar from "../../components/general/SearchBar.vue";
import { useAlertStore } from "../../stores/AlertStore";
import AlertPrompt from "../../components/general/AlertPrompt.vue";
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import ConfirmPrompt from "../../components/general/ConfirmPrompt.vue";

export default {
    data() {
        return {
            blogs: [],
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore(),
        };
    },
    components: {
        SearchBar,
        AlertPrompt,
        ConfirmPrompt,
    },
    created() {
        this.getPosts();
    },
    methods: {
        // method to get blog data
        async getPosts() {
            await fetch(
                `${process.env.APP_SERVER_URL}/api/posts/explore`,
                {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.blogs = data;
                    });
                })
                .catch((error) => {
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
        },
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
    },
};
</script>
