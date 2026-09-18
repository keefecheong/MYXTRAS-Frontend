<template>
    <div id="searchbar-container" class="banner-container">
        <div class="user-details" v-if="isMobile">
            <p
                class="hide-overflow-text"
                id="searchbar-realname"
                :title="realname"
            >
                {{ realname }}
            </p>
            <p class="hide-overflow-text" id="searchbar-school">
                {{ school + "/" + course }}
            </p>
        </div>
        <div id="search-input">
            <span
                class="material-symbols-outlined"
                id="search-icon"
                @click="performSearch"
                title="Click to search"
                >search</span
            >
            <input
                id="searchbar-input"
                type="text"
                placeholder="Search"
                v-model="searchTerm"
                @keyup.enter="performSearch"
                @focus.capture="() => toggleResults(true)"
                @blur.capture="(e) => toggleResults(false, e)"
                title="Search for a user or forum"
            />

            <SearchResults
                v-if="showResults && searchResults != null"
                :results="searchResults"
            />
        </div>

        <div id="searchbar-right">
            <div v-if="currentPage.startsWith('/forum.html')">
                <button
                    v-if="!isMobile"
                    id="create-forum-btn"
                    class="white-btn"
                    @click="showForumForm"
                >
                Create Forum
                <i class="bi bi-plus plus-icon"></i>
                </button>
                <div v-if="isMobile" class="mobile-create-container">
                    <p>Create Forum</p>
                    <span
                        class="material-symbols-outlined"
                        @click="showForumForm"
                        >add_circle</span
                    >
                </div>
            </div>

            <div v-else-if="login">
                <div v-if="!isMobile" class="user-details">
                    <p
                        class="hide-overflow-text"
                        id="searchbar-realname"
                        :title="realname"
                    >
                        {{ realname }}
                    </p>
                    <p class="hide-overflow-text" id="searchbar-school">
                        {{ school + "/" + course }}
                    </p>
                </div>
                <div class="searchbar-pfp-container">
                    <a href="/profilePage.html">
                        <img class="searchbar-profile-pic" :src="pfplink" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
p {
    margin-bottom: 0;
}
</style>

<style>
@import url("../../styles/main.css");
@import url("../../styles/banner-styles.css");

.white-btn {
    font-weight: bold;
    background-color: white;
    color: black;
    border-radius: 5px;
    margin: 0 2vw;
    white-space: normal;
    text-align: center;
    font-size: 1vw;
    color: black;
    transition: all 0.3s !important;
}
.white-btn > i {
    color: black !important;
    min-height: 100%;
    min-width: 100%;
    text-align: center;
    font-size: 1.5em !important;
    justify-content: center;
}

.white-btn:hover > i {
    color: white !important;
}
#searchbar-container {
    --ideal-right-content-height: 10dvh;
    --min-right-content-height: 54px;
    --max-right-content-height: 70px;
    background-color: var(--primary);
}

#search-input {
    width: 50%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    background-color: white;
    border-radius: 30px;
    box-shadow: 2px 2px 4px #5e5e5e;
    padding: 15px;
}

#search-icon {
    padding-left: 15px;
    margin: 0;
    font-size: 1.5rem;
    color: black;
}

#searchbar-input {
    border: none;
    outline: none;
    width: 90%;
    background: none;
}

#searchbar-input:focus {
    border-bottom: 1px solid black;
}

#searchbar-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: center;
    padding-right: 2% !important;
}

#create-forum-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em 5em;
    margin-bottom: 0;
    border-radius: 10px;
    box-sizing: border-box;
    white-space: nowrap;
}

#searchbar-right > div {
    max-width: 45%;
    height: clamp(
        var(--min-right-content-height),
        var(--ideal-right-content-height),
        var(--max-right-content-height)
    );
    position: relative;
    left: 100%;
    transform: translateX(-100%);
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
}

#searchbar-realname,
#searchbar-school {
    color: white;
}

#searchbar-right > div > a {
    height: 100%;
}

.searchbar-profile-pic {
    max-height: 100%;
    max-width: 100%;
    border: #133b5b 4px solid;
    border-radius: 100%;
    object-fit: cover;
    object-position: center;
}

/* Login button CSS */
.codepen-button {
    display: block;
    cursor: pointer;
    color: rgb(0, 0, 0);
    margin: auto;
    margin-right: 4rem;
    position: relative;
    text-decoration: none;
    font-weight: 600;
    border-radius: 10px;
    overflow: hidden;
    padding: 3px;
    isolation: isolate;
}

.codepen-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 400%;
    height: 100%;
    background: linear-gradient(
        115deg,
        #bf1950,
        var(--primary),
        var(--secondary)
    );
    background-size: 25% 100%;
    animation: login-border-animation 0.75s linear infinite;
    animation-play-state: paused;
    translate: -5% 0%;
    transition: translate 0.25s ease-out;
}

.codepen-button:hover::before {
    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
}

@keyframes login-border-animation {
    to {
        transform: translateX(-25%);
    }
}

.codepen-button span {
    position: relative;
    display: block;
    padding: 0.7rem 1.5rem;
    font-size: 1.1rem;
    background: #ffffff;
    border-radius: 10px;
    height: 100%;
}
.searchbar-pfp-container {
    max-width: 72px;
}

@media screen and (max-width: 768px) {
    #create-forum-btn {
        font-size: 14px;
    }
    #search-input {
        min-width: 50vw !important;
    }
    .mobile-create-container {
        color: white;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-size: 11px;
    }
    .mobile-create-container > .material-symbols-outlined {
        display: block;
    }
    #searchbar-realname {
        width: 10vw;
    }
    #search-input {
        left: 31%;
    }
    .user-details {
        margin-left: 20px !important;
    }
    #searchbar-right {
        position: absolute;
        right: 0;
    }
    .searchbar-profile-pic {
        height: 48px;
        width: 48px;
    }
    .searchbar-pfp-container {
        width: 100%;
        text-align: center;
        align-items: center;
        justify-content: center;
    }
    .searchbar-pfp-container > a {
        margin-right: 10px;
    }
}
</style>

<script>
import SearchResults from "../../components/general/SearchResults.vue";

export default {
    components: {
        SearchResults,
    },
    data() {
        return {
            login: false,
            realname: "",
            school: "",
            course: "",
            searchResults: null,
            searchTerm: "",
            showResults: false,
            currentPage: location.pathname,
            isMobile: false,
        };
    },
    mounted() {
        this.checkAuth();
        // check if its mobile to display smaller plus icon instead of create button
        this.isMobile = window.innerWidth <= 768;
        window.addEventListener("resize", this.handleResize);
    },
    beforeDestroy() {
        // Clean up the event listener
        window.removeEventListener("resize", this.handleResize);
    },
    emits: ["show-forum-form"],
    methods: {
        handleResize() {
            // Update the view when the window width changes
            this.isMobile = window.innerWidth <= 768;
        },
        showForumForm() {
            this.$emit("show-forum-form");
        },
        async performSearch() {
            let searchObject;

            if (
                this.currentPage.startsWith("/feed.html") ||
                this.currentPage == "/"
            ) {
                searchObject = "users";
            } else if (this.currentPage.startsWith("/forum.html")) {
                searchObject = "forums";
            } else if (this.currentPage.startsWith("/explore.html")) {
                searchObject = "users-forums";
            }

            try {
                await fetch(
                    `${
                        process.env.APP_SERVER_URL
                    }/api/search/${searchObject}?term=${this.searchTerm.trim()}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                ).then(async (response) => {
                    await response.json().then((data) => {
                        this.searchResults = data.topSixResults;

                        this.showResults = true;
                    });
                });
            } catch (error) {
                console.error("Error performing search:", error);
            }
        },
        async checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            await fetch(
                `${
                    process.env.APP_SERVER_URL
                }/api/users/cookie/verify`,
                {
                    method: "GET",
                    credentials: "include",
                },
            )
                .then(async (response) => {
                    if (response.ok) {
                        await response.json().then((data) => {
                            // Checks if user has setup their profile, if not:
                            if (data.is_profile_setup === false) {
                                location.href = "/setupProfile.html";
                                return;
                            } else {
                                this.realname = data.real_name;
                                this.school = data.school;
                                this.course = data.course;
                                this.pfplink = data.profile_pic_link;
                                this.login = true;
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
        // to show/hide results
        toggleResults(show, e) {
            // dont hide results if the new focused element is the search results container
            const searchResultsContainer =
                document.querySelector(".resultsContainer");

            if (
                searchResultsContainer &&
                searchResultsContainer == e?.relatedTarget
            ) {
                return;
            }

            this.showResults = show;
        },
    },
};
</script>
