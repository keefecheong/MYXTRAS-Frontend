<!-- layout for normal profile page view -->

<template>
    <button class="toggle-button" @click="toggleBetween()">
        {{ viewingProfile ? "View Details" : "Profile Page" }}
    </button>
    <div id="profile-page-view-container">
        <div id="left-content">
            <img :src="user.banner_pic_link" alt="Banner" id="banner-picture" />

            <div id="header-content">
                <div id="header-user-details-container">
                    <img
                        :src="user.profile_pic_link"
                        alt="Profile Picture"
                        id="profile-picture"
                    />

                    <div id="header-user-details">
                        <div id="header-user-name">
                            <span id="user-realname">{{ user.real_name }}</span>
                            <span id="user-username" class="hide-overflow-text"
                                >@{{ user.username }}</span
                            >
                        </div>

                        <div id="header-user-school">
                            <span>From the</span>
                            <span id="user-school"
                                >School of {{ user.school }} - Diploma in
                                {{ user.course }}</span
                            >
                        </div>

                        <div
                            id="header-user-biography"
                            v-if="user.biography != ''"
                        >
                            <span>About me:</span>
                            <span id="user-biography">{{
                                user.biography
                            }}</span>
                        </div>

                        <div
                            id="header-user-interests"
                            v-if="user.interests.length > 0"
                        >
                            <span>Interested in: </span>
                            <InterestBadgeList
                                :selectedOption="user.interests"
                                :selection="false"
                            />
                        </div>
                    </div>
                </div>

                <div id="header-user-actions">
                    <div id="header-user-privileged-actions" v-if="isSelf">
                        <a
                            href="/profileManagement.html"
                            data-tooltip="Edit Profile"
                            data-tooltip-position="top"
                        >
                            <span
                                id="user-edit-icon"
                                class="material-symbols-outlined"
                                >edit</span
                            >
                        </a>
                    </div>

                    <div
                        id="sign-out-container"
                        @click="signOut"
                        v-if="isSelf"
                        title="Sign out"
                    >
                        <span
                            id="user-sign-out-icon"
                            class="material-symbols-outlined"
                            >logout</span
                        >
                        <span id="user-sign-out-text">Sign out</span>
                    </div>

                    <div v-if="!isSelf" id="user-actions-container">
                        <div
                            v-if="!blockedByUser && !blockingUser"
                            id="user-interact-actions"
                        >
                            <button
                                @click="toggleFollow"
                                id="follow-btn"
                                :class="{ followed: following }"
                            >
                                {{ following ? "Followed" : "Follow" }}
                            </button>

                            <button id="msg-btn" @click="createChat">
                                Message
                            </button>
                        </div>

                        <div id="user-report-actions" v-if="!isSelf">
                            <span
                                @click="blockUser"
                                :title="
                                    blockingUser
                                        ? 'Unblock this user'
                                        : 'Block this user'
                                "
                                >{{ blockingUser ? "Unblock" : "Block" }}</span
                            >

                            <span
                                @click="() => toggleReportForm(true)"
                                :title="'Report this user'"
                                >Report</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div id="profile-page-content">
                <div v-if="isSelf" id="profile-post-toggle-container">
                    <span>Posts:</span>
                    <span
                        class="sub-navigation"
                        :class="{ active: !viewingSaved }"
                        @click="() => viewSaved(false)"
                        >Created</span
                    >
                    <span
                        class="sub-navigation"
                        :class="{ active: viewingSaved }"
                        @click="() => viewSaved(true)"
                        >Saved</span
                    >
                </div>

                <div
                    v-if="
                        blogsToDisplay.length > 0 &&
                        !blockedByUser &&
                        !blockingUser
                    "
                >
                    <BlogLayout
                        v-for="blog in blogsToDisplay"
                        :blog="blog"
                        :highlightComment="
                            blog._id == postId && commentId ? commentId : null
                        "
                        :key="blog._id"
                    />
                </div>

                <div
                    v-if="
                        blogsToDisplay.length <= 0 ||
                        blockedByUser ||
                        blockingUser
                    "
                    id="profile-no-posts"
                >
                    <p>No posts {{ viewingSaved ? "saved" : "created" }}.</p>
                </div>
            </div>

            <div class="floating-button-wrapper" v-if="isSelf">
                <div
                    class="floating-button"
                    @click="
                        () => {
                            toggleCreateBlog(true);
                        }
                    "
                >
                    <div data-tooltip="Create Post" data-tooltip-position="top">
                        <i class="bi bi-plus plus-icon"></i>
                    </div>
                </div>
            </div>
        </div>

        <div id="right-content" :class="{ 'hide': onSmallScreen }">
            <!-- view warnings and submitted reports -->
            <router-link to="/support">
                <button
                    type="button"
                    title="View Support Requests"
                    id="support-request-button"
                >
                    Support Requests
                </button>
            </router-link>

            <div class="card card-body card-position">
                <h5 class="card-title">
                    Followers: {{ user.followers.length }}
                </h5>

                <div
                    v-if="user.followers.length === 0"
                    class="row center-align"
                >
                    <p id="no-followers">No followers ☹</p>
                    <p id="no-followers">
                        Head to the
                        <a class="a-link" href="/explore.html">Xplore</a> page!
                    </p>
                </div>

                <div
                    class="view-user-follower"
                    title="View user"
                    v-else
                    v-for="follower in user.followers"
                    :key="follower.username"
                    @click="viewFollower(follower._id)"
                >
                    <img class="profilepic" :src="follower.profile_pic_link" />
                    <span class="follower-username">{{
                        follower.username
                    }}</span>
                </div>
            </div>

            <CreatedForums />
            <SubscribedForums />
        </div>
    </div>

    <BlogFormLayout
        v-if="showCreateBlog"
        @close-blog-form="
            () => {
                toggleCreateBlog(false);
            }
        "
    />

    <ReportFormLayout
        v-if="!isSelf && showReportForm"
        :userId="user._id"
        :type="'user'"
        @close-report-form="() => toggleReportForm(false)"
    />
</template>

<script>
import SubscribedForums from "../../components/forum/SubscribedForums.vue";
import CreatedForums from "../../components/forum/CreatedForums.vue";

import banner from "../../assets/CustomBanner.png";

import BlogLayout from "../../components/blog/BlogLayout.vue";
import BlogFormLayout from "../../components/blog/BlogFormLayout.vue";

import InterestBadgeList from "../../components/general/InterestBadgeList.vue";

import ReportFormLayout from "../../components/report/ReportFormLayout.vue";

import ObjectID from "bson-objectid";
import { debounce } from "lodash";
import viewUser from "../../utils/general/viewUser.js";
import signOut from "../../utils/authentication/signOut.js";

import highlightElement from "../../utils/general/highlightElement.js";

import { useConfirmStore } from "../../stores/ConfirmStore.js";
import { useAlertStore } from "../../stores/AlertStore.js";

export default {
    components: {
        SubscribedForums,
        CreatedForums,
        BlogLayout,
        BlogFormLayout,
        InterestBadgeList,
        ReportFormLayout,
    },
    props: ["userData", "blogs"],
    emits: ["start-loading", "stop-loading"],
    data() {
        return {
            user: null,
            self: null,
            isSelf: false,

            blockedByUser: false,
            blockingUser: false,

            banner: banner,
            savedBlogs: [],
            savedLoaded: false,
            viewingSaved: false,
            postId: "",
            commentId: "",
            viewingProfile: true,

            following: false,
            savedFollowing: false,
            followerCount: 0,
            debouncedFollowUpdate: null,

            showCreateBlog: false,
            showReportForm: false,

            alert: useAlertStore().alert,
        };
    },
    created() {
        // save user data
        this.user = this.userData.user;

        // save information about self for future use (pushing to follower list)
        this.self = this.userData.self;
        this.isSelf = this.user._id == this.self._id;

        // initialize follower information/status
        this.following = this.userData.isFollowing;
        this.savedFollowing = this.userData.isFollowing;
        this.followerCount = this.userData.user.followers.length;

        // set block status
        this.blockedByUser = this.userData.blockedByUser;
        this.blockingUser = this.userData.blockingUser;

        const query = location.search;

        if (query) {
            // automatically open create blog form if href is /profilePage.html?create and requested user is self
            if (query == "?create" && this.isSelf) {
                this.showCreateBlog = true;
            }

            const params = new URLSearchParams(query);

            // set postId and commentId to highlight item (coming from admin reports page)
            if (params.has("post")) {
                this.postId = params.get("post");

                if (params.has("comment")) {
                    this.commentId = params.get("comment");
                }
            }
        }

        // set debounce function to only send request to update backend if user has not clicked the follow button for 3 seconds
        this.debouncedFollowUpdate = debounce(this.updateFollowing, 3000);

        // set event listener to complete pending request when page is closed
        window.addEventListener("beforeunload", this.completeFollowRequest);
    },
    mounted() {
        if (!this.postId) return;

        // if postId is set then scroll to and highlight the post and remove highlight after 5 seconds
        setTimeout(() => {
            const targetPost = document.getElementById(this.postId);

            if (targetPost) {
                targetPost.scrollIntoView({
                    block: "center",
                });

                highlightElement(targetPost);
            }
        }, 100);
    },
    beforeUnmount() {
        this.completeFollowRequest();
    },
    methods: {
        toggleBetween() {
            const left_content = document.getElementById("left-content");
            const right_content = document.getElementById("right-content");

            this.viewingProfile = !this.viewingProfile; // Toggle
            if (this.viewingProfile) {
                right_content.classList.add("hide");
                left_content.classList.remove("hide");
            } else {
                right_content.classList.remove("hide");
                left_content.classList.add("hide");
            }
        },
        // to get user's saved posts if user is viewing his own profile
        async getSavedPosts() {
            await fetch(`${process.env.APP_SERVER_URL}/api/posts/saved`, {
                mode: "cors",
                method: "GET",
                credentials: "include",
            })
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.savedBlogs = data;
                        this.savedLoaded = true;
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // to sign out and clear cookies
        async signOut() {
            const success = await signOut();

            if (success) {
                location.href = "/login.html";
            } else {
                console.log("Failed to log out.");
            }
        },
        // toggle following user
        toggleFollow() {
            // toggle following value for frontend
            this.following = !this.following;

            // update follower count
            // update followers list to display list of followers
            if (this.following) {
                this.followerCount += 1;
                this.user.followers.push(this.self);
            } else {
                this.followerCount -= 1;

                const index = this.user.followers.findIndex(
                    (follower) => follower._id == this.self._id
                );
                this.user.followers.splice(index, 1);
            }

            this.debouncedFollowUpdate();
        },
        // handle updating of following status to backend
        async updateFollowing() {
            if (this.isSelf) {
                return;
            }

            const targetURL = `${process.env.APP_SERVER_URL}/api/users/${this.user._id}/follow`;
            const options = {
                mode: "cors",
                credentials: "include",
            };

            // send request to update follow status
            // only send request to follow user if new following value is true and currently saved following value is false
            if (this.following && !this.savedFollowing) {
                options.method = "POST";

                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 201) {
                            this.savedFollowing = true;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            // only send request to unfollow user if new following value is false and currently saved following value is true
            else if (!this.following && this.savedFollowing) {
                options.method = "DELETE";

                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 204) {
                            this.savedFollowing = false;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        // complete updateFollowing request if pending
        completeFollowRequest() {
            this.debouncedFollowUpdate.flush();
        },
        // to toggle create blog form
        toggleCreateBlog(show) {
            this.showCreateBlog = show;
        },
        // to view follower user profile
        viewFollower(userId) {
            console.log("view follower");
            viewUser(userId);
        },
        // to create chat with the user and go to chat.html
        async createChat() {
            // check if chat exists
            // if exists: target = existing chat
            // otherwise: target = null
            let target = null;

            await fetch(
                `${process.env.APP_SERVER_URL}/api/chats/check/${this.user._id}`,
                {
                    mode: "cors",
                    methods: "GET",
                    credentials: "include",
                }
            ).then(async (res) => {
                await res.json().then(async (data) => {
                    if (res.ok) {
                        target = data.existingChat;
                    } else {
                        // if response is not ok either an error occurred on backend/user is requesting to chat with himself
                        // display error and do nothing
                        await this.alert(data.message);
                        return;
                    }
                });
            });

            // if chat does not exist then create new chat
            if (!target) {
                target = {
                    // create new ObjectID for immediate access
                    _id: new ObjectID().toString(),
                    targetUserId: this.user._id,
                    name: this.user.username,
                    pic: this.user.profile_pic_link,
                    last_message_timestamp: Date.now(),
                };
            }

            // set selectedChat and go to chat page
            sessionStorage.setItem("selectedChat", JSON.stringify(target));
            location.href = "/chat.html";
        },
        // to toggle between created and saved blogs
        async viewSaved(viewSaved) {
            // if user is viewing his own profile and toggles to saved posts, retrieved saved posts if not already retrieved
            if (viewSaved && this.isSelf && !this.savedLoaded) {
                this.toggleChildLoading(true);

                await this.getSavedPosts();

                this.toggleChildLoading(false);
            }

            this.viewingSaved = viewSaved;
        },
        // to block/unblock a user
        async blockUser() {
            const confirmBlock = await useConfirmStore().confirm(
                `Are you sure you want to ${
                    this.blockingUser ? "unblock" : "block"
                } this user?`
            );

            if (!confirmBlock) {
                return;
            }

            this.toggleChildLoading(true);

            await fetch(
                `${process.env.APP_SERVER_URL}/api/users/${this.user._id}/block`,
                {
                    method: this.blockingUser ? "DELETE" : "POST",
                    mode: "cors",
                    credentials: "include",
                }
            ).then(async (res) => {
                await res.json().then(async (data) => {
                    await this.alert(data.message);

                    // only update blockingUser if response is ok (block/unblock succeeded)
                    if (res.ok) {
                        this.blockingUser = !this.blockingUser;
                    }

                    this.toggleChildLoading(false);
                });
            });
        },
        // to show/hide report form
        toggleReportForm(show) {
            this.showReportForm = show;
        },
        // to toggle loading wheel on profile page
        toggleChildLoading(loading) {
            loading ? this.$emit("start-loading") : this.$emit("stop-loading");
        },
    },
    computed: {
        // to get the correct set of blogs to display
        blogsToDisplay() {
            return this.viewingSaved ? this.savedBlogs : this.blogs;
        }
    },
};
</script>

<style scoped>
.card {
    padding: 40px 0;
    border-radius: 15px;
    max-height: 60vh;
    flex: 0 0 auto;
}
</style>

<style>
#profile-page-view-container {
    display: flex;
    flex-direction: row;
}

.toggle-button {
    display: none;
    margin: 4vh;
    border-radius: 5px;
}

#left-content {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0px;
    flex-grow: 1;
}

#right-content {
    background-color: var(--primary);
    padding: 25px;
    flex: 0 0 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 50px;

    > * {
        width: 100%;
    }

    #support-request-button {
        outline: none;
        border: none;
        padding: 20px;
        font-size: 1.5em;
        width: 100%;
        border-radius: 15px;
    }

    #support-request-button:hover {
        color: var(--primary);
    }
}

#banner-picture {
    height: clamp(50px, 20dvh, 150px);
    width: 100%;
}

#profile-picture {
    border: 5px solid white;
    border-radius: 50%;
    height: var(--profile-pic-size);
    width: var(--profile-pic-size);
    position: relative;
    bottom: clamp(20px, 5dvw, 70px);
}

#header-user-name {
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: baseline;
}

#user-realname {
    font-weight: bold;
    font-size: 2rem;
}

#user-username {
    font-size: 20px;
    max-width: 20vw;
}

#header-content {
    position: relative;
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 20px 30px;
    column-gap: 30px;
    margin-bottom: 20px;
}

#header-content::before {
    content: "";
    height: 1px;
    position: absolute;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5%;
    background-color: lightgray;
}

#header-user-details-container {
    --profile-pic-size: clamp(80px, 15dvw, 170px);
    flex: 1 0 auto;
    position: relative;
    display: flex;
    flex-direction: row;
    column-gap: 20px;
}

#header-user-details {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

#header-user-school,
#header-user-biography,
#header-user-interests {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
}

#user-school,
#user-biography {
    font-style: italic;
}

#header-user-actions {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    align-items: end;
    flex-grow: 1;
    flex-basis: 10%;
    width: 100%;
    padding-top: 10px;
}

#user-actions-container {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
}

#user-interact-actions {
    display: flex;
    flex-direction: row;
    column-gap: 15px;
}

#sign-out-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    cursor: pointer;
    font-size: 1.5em;
    align-items: center;

    > * {
        color: red !important;
    }

    #user-sign-out-icon {
        font-size: 2rem;
    }

    #user-sign-out-text {
        white-space: nowrap;
        margin-top: -2px;
    }

    @media (max-width: 576px) {
        #user-sign-out-text {
            display: none;
        }
    }
}

#user-report-actions {
    display: flex;
    flex-direction: column;
    align-items: start;
    width: fit-content;
    cursor: pointer;
    color: #dd1217;
    position: relative;
    left: 100%;
    transform: translateX(-100%);
}

#sign-out-container:hover,
#user-report-actions > span:hover {
    opacity: 0.7;
}

#user-edit-icon {
    font-size: 2rem;
    color: black;
}

#profile-page-content {
    width: clamp(350px, 50%, 1000px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    flex-grow: 1;
}

#profile-post-toggle-container {
    display: flex;
    flex-direction: row;
    column-gap: 50px;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
}

#profile-no-posts {
    text-align: center;
}

.view-user-follower {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    margin-top: 20px;
    align-items: center;
    margin-left: 15%;
}

.view-user-follower * {
    cursor: pointer;
}

.profilepic {
    overflow: hidden;
    width: 65px;
    height: 65px;
    border-radius: 50%;
}

.follower-username:hover {
    color: var(--primary);
}

.three-dots {
    position: absolute;
    bottom: 0;
    margin-left: 5px;
    margin-bottom: 15px;
}

.floating-button-wrapper {
    position: sticky;
    bottom: 20px;
    left: 100%;
    width: fit-content;
    z-index: 5;
}

.floating-button {
    background-color: var(--primary);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 15px;
    color: white;
}

.plus-icon {
    font-size: 24px;
}

#follow-btn,
#msg-btn {
    background-color: transparent;
    border: var(--primary) solid 3px;
    color: var(--primary);
    border-radius: 10px;
    width: 50%;
    padding: 5px 10px;
    transition: all 0.3s;
}

#follow-btn:hover {
    background-color: var(--primary);
    color: white;
}

#follow-btn.followed {
    background-color: var(--primary);
    color: white;
}

#follow-btn.followed:hover {
    background-color: transparent;
    color: var(--primary);
}

#msg-btn {
    color: var(--dark);
    border-color: var(--dark);
}

#msg-btn:hover {
    background-color: var(--dark);
    color: white;
}

#no-followers {
    margin-top: 30px;
}

.hide {
    display: none !important;
}

/* medium screens and smaller */
@media screen and (max-width: 992px) {
    body {
        text-align: center !important;
        font-size: 14px !important;
    }

    p {
        font-size: 14px;
    }

    #white-container {
        max-width: 100vw;
    }

    .toggle-button {
        display: block;
        border: 5px solid var(--primary);
        background-color: var(--primary);
        color: white;
    }

    .toggle-button:hover {
        background-color: transparent;
        color: var(--primary);
        font-weight: bold;
    }

    #left-content,
    #right-content {
        min-width: 100%;
    }

    #main-content {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
        min-height: 100vh;
    }

    #settings-options {
        display: inline-block;
        margin-left: 3vw;
        margin-bottom: 10vh;
    }

    #user-edit-icon {
        font-size: 2rem;
        color: black;
        float: left;
        margin-left: -55px;
    }

    #user-sign-out-icon {
        font-size: 2rem;
        float: left;
        margin-left: -55px;
    }

    #user-sign-out-text {
        display: none;
    }

    #header-user-details {
        max-width: 50vw;
    }

    #header-user-actions {
        margin-left: 6vw;
    }

    #main-content {
        padding: 0;
    }
}
</style>

<style>
@import url("../../styles/main.css");
</style>
