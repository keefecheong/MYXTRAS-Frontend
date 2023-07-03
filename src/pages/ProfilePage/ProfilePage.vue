<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt v-if="showConfirm && confirmMsg.length > 0" @close-confirm="closeConfirm">
        {{ confirmMsg }}
    </ConfirmPrompt>
    
    <div id="main-container">
        <NavSidebar />
        <div id="main-content">
            <div class="row">
                <div id="left-content" class="col-md-9">
                    <div class="banner">
                        <img :src="banner" alt="Banner" id="banner-picture" />
                    </div>                    
                    
                    <div id="header-content">
                        <div id="header-user-details-container">
                            <img :src="user.profile_pic_link" alt="Profile Picture" id="profile-picture" />

                            <div id="header-user-details">
                                <div id="header-user-name">
                                    <span id="user-realname">{{ user.real_name }}</span>
                                    <span id="user-username" class="hide-overflow-text">@{{ user.username }}</span>
                                </div>

                                <div id="header-user-school">
                                    <span>From the</span>
                                    <span id="user-school">School of {{ user.school }} - Diploma in {{ user.course }}</span>
                                </div>
                                
                                <div id="header-user-biography" v-if="user.biography != ''">
                                    <span>About me:</span>
                                    <span id="user-biography">{{ user.biography }}</span>
                                </div>

                                <div id="header-user-interests" v-if="user.interests.length > 0">
                                    <span>Interested in: </span>
                                    <InterestBadgeList :selectedOption="user.interests" :selection="false" />
                                </div>
                            </div>
                            
                        </div>

                        <div id="header-user-actions">
                            <div id="header-user-privileged-actions" v-if="isSelf">
                                <a href="/profileManagement.html" title="Edit profile">
                                    <span id="user-edit-icon" class="bi bi-pencil"></span>
                                </a>
                            </div>

                            <div id="sign-out-container" @click="signOut" v-if="isSelf">
                                <span id="user-sign-out-icon" class="bi bi-box-arrow-right"></span>
                                <span id="user-sign-out-text">Sign out</span>
                            </div>

                            <button v-if="!isSelf" @click="toggleFollow" :class="following ? 'follow-btn followed' : 'follow-btn'">{{ following ? 'Followed' : 'Follow' }}</button>

                            <button v-if="!isSelf" class="msg-btn" @click="createChat">Message <span class="material-symbols-outlined">Chat</span></button>
                        </div>
                    </div>

                    <div id="header-content-border-bottom"></div>

                    <div id="profile-page-content">
                        <div v-if="isSelf" id="profile-post-toggle-container">
                            <span>Posts:</span>
                            <span class="sub-navigation" :class="{ 'active': !viewingSaved }" @click="() => viewSaved(false)">Created</span>
                            <span class="sub-navigation" :class="{ 'active': viewingSaved }" @click="() => viewSaved(true)">Saved</span>
                        </div>
                        
                        <div v-if="blogsToDisplay.length > 0">
                            <BlogLayout v-for="blog in blogsToDisplay" :blog="blog" />
                        </div>

                        <div v-else id="profile-no-posts">
                            <p>No posts {{ viewingSaved ? 'saved' : 'created' }}.</p>
                        </div>
                    </div>

                    <div class="floating-button-wrapper" v-if="isSelf">
                        <div class="floating-button" @click="() => { toggleCreateBlog(true) }">
                            <i style="color: white" class="bi bi-plus plus-icon"></i>
                        </div>
                    </div>
                </div>

                <div id="right-content" class="col-md-3">
                    <div class="card follower-card">
                        <div class="card-body card-position">
                            <h5 class="card-title">Followers: {{ user.followers.length }}</h5>

                            <div
                                class="view-user-follower"
                                title="View user"
                                v-for="follower in user.followers"
                                :key="follower.username"
                                @click="viewFollower(follower._id)"
                            >
                                <img class="profilepic" :src="follower.profile_pic_link">
                                <span class="follower-username">{{ follower.username }}</span>
                            </div>
                        </div>
                    </div>
                    <CreatedForums />
                    <SubscribedForums />
                </div>
            </div>

            <BlogFormLayout v-if="showCreateBlog" @close-blog-form="() => { toggleCreateBlog(false) }" />
        </div>

    </div>
</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SubscribedForums from '../../components/forum/SubscribedForums.vue';
import CreatedForums from '../../components/forum/CreatedForums.vue';
import banner from '../../assets/CustomBanner.png';
import BlogLayout from '../../components/blog/BlogLayout.vue';
import BlogFormLayout from '../../components/blog/BlogFormLayout.vue';
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import ConfirmPrompt from '../../components/general/ConfirmPrompt.vue';
import ObjectID from 'bson-objectid';
import { viewFollower } from '../../utils/general/viewUser.js';
import signOut from '../../utils/authentication/signOut';
import { debounce } from 'lodash';

export default {
    components: {
        NavSidebar,
        SubscribedForums,
        CreatedForums,
        BlogLayout,
        BlogFormLayout,
        InterestBadgeList,
        AlertPrompt,
        ConfirmPrompt
    },
    data() {
        return {
            targetUserId: null,

            user: null,
            self: null,
            isSelf: false,

            banner: banner,
            blogs: [],
            savedBlogs: [],
            forums: [],
            viewingSaved: false,

            following: false,
            savedFollowing: false,
            followerCount: 0,
            debouncedFollowUpdate: null,

            showCreateBlog: false,
            refreshFlag: false,
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore()
        }
    },
    created() {
        // if page is reloaded then use the stored tempUser field as the target user
        if (window.performance.getEntriesByType('navigation').map((nav) => nav.type).includes('reload')) {
            this.targetUserId = sessionStorage.getItem('tempUser');
            sessionStorage.removeItem('tempUser');
        }
        else {
            // if 'followerId' is present in sessionStorage then view that profile
            const followerId = sessionStorage.getItem('followerId');
            const userId = sessionStorage.getItem('user');

            if (followerId) {
                this.targetUserId = followerId;
                sessionStorage.removeItem('followerId');
            }
            // otherwise if 'user' is present in sessionStorage then view that profile
            else if (userId) {
                this.targetUserId = userId;
            }
            // default to self
            else {
                this.targetUserId = 'self';
            }
        }

        // initialize data
        this.initData();
        
        // automatically open create blog form if href is /profilePage.html?create and requested user is self
        if (window.location.search == '?create' && this.isSelf) {
            this.showCreateBlog = true;
        }

        // set debounce function to only send request to update backend if user has not clicked the follow button for 3 seconds
        this.debouncedFollowUpdate = debounce(this.updateFollowing, 3000);

        // set event listener to complete pending request when page is closed
        window.addEventListener('beforeunload', this.completeFollowRequest);

        window.addEventListener('beforeunload', this.handleUnload);
    },

    beforeUnmount() {
        this.completeFollowRequest();
    },
    methods: {
        // save user id as a temp field in sessionStorage and remove current user field
        // tempUser will be used to continue viewing the current user if page refreshes
        // if user goes to another page 'user' field will be unset - prevent profile page stuck on a user
        handleUnload() {
            sessionStorage.setItem('tempUser', this.user._id);
            sessionStorage.removeItem('user');
        },
        // to get user profile and associated posts
        async initData() {
            // get user profile and follow status
            const userPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/${this.targetUserId}`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    // save user data
                    this.user = data.user;

                    // save information about self for future use (pushing to follower list)
                    this.self = data.self;
                    this.isSelf = this.user._id == this.self._id;

                    // get user's saved posts if viewing his own profile
                    if (this.isSelf) {
                        this.getSavedPosts();
                    }

                    // initialize follower information/status
                    this.following = data.isFollowing;
                    this.savedFollowing = data.isFollowing;
                    this.followerCount = data.user.followers.length;
                });
            }).catch(error => {
                console.log(error);
            });

            // get user's posts
            const postPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/by/${this.targetUserId}`, {
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

            await Promise.all([userPromise, postPromise]).catch(error => {
                console.log(error);
            });
        },
        // to get user's saved posts if user is viewing his own profile
        async getSavedPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/saved`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(async res => {
                await res.json().then(data => {
                    this.savedBlogs = data;
                });
            }).catch(error => {
                console.log(error);
            });
        },
        // to sign out and clear cookies
        async signOut() {
            const success = await signOut();
            
            if (success) {
                location.href = '/login.html';
            }
            else {
                console.log('Failed to log out.');
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
            }
            else {
                this.followerCount -= 1;

                const index = this.user.followers.findIndex(follower => follower._id == this.self._id);
                this.user.followers.splice(index, 1);
            }

            this.debouncedFollowUpdate();
        },
        // handle updating of following status to backend
        async updateFollowing() {
            if (this.isSelf) {
                return;
            }

            const targetURL = `${import.meta.env.VITE_APP_SERVER_URL}/api/users/follow/${this.user._id}`;
            const options = {
                mode: 'cors',
                credentials: 'include'
            }

            // send request to update follow status
            // only send request to follow user if new following value is true and currently saved following value is false
            if (this.following && !this.savedFollowing) {
                options.method = 'POST';

                await fetch(targetURL, options).then(async (res) => {
                    if (res.status == 201) {
                        this.savedFollowing = true;
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
            // only send request to unfollow user if new following value is false and currently saved following value is true
            else if (!this.following && this.savedFollowing) {
                options.method = 'DELETE';

                await fetch(targetURL, options).then(async (res) => {
                    if (res.status == 204) {
                        this.savedFollowing = false;
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch(error => {
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
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // to close confirm prompt
        closeConfirm(decision) {
            this.confirmStore.closeConfirm(decision);
        },
        // to view follower user profile
        viewFollower(userId) {
            viewFollower(userId);
        },
        // to create chat with the user and go to chat.html
        async createChat() {
            // check if chat exists
            // if exists: target = existing chat
            // otherwise: target = null
            let target = null;

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chats/check/${this.user._id}`, {
                mode: 'cors',
                methods: 'GET',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(data => {
                    if (res.ok) {
                        target = data.existingChat;
                    }
                    else {
                        // if response is not ok either an error occurred on backend/user is requesting to chat with himself
                        // display error and do nothing
                        this.alertStore.alert(data.message);
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
                    last_message_timestamp: Date.now()
                }
            }

            // set selectedChat and go to chat page
            sessionStorage.setItem('selectedChat', JSON.stringify(target));
            location.href = '/chat.html';
        },
        // to toggle between created and saved blogs
        viewSaved(viewSaved) {
            this.viewingSaved = viewSaved;
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
        // to get the correct set of blogs to display
        blogsToDisplay() {
            return this.viewingSaved ? this.savedBlogs : this.blogs;
        }
    }
}

</script>

<style scoped>
#main-content .row {
    height: 100%;
}
.card {
    padding: 1em 0 1em 0;
    border-radius: 15px;
    margin-bottom: 60px;
    min-height: 50vh;
    max-height: 60vh;
}
.card-body {
    overflow-y: scroll;
}
</style>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
@import url('../../styles/forums/common-forum-styles.css');

#left-content {
    display: flex;
    flex-direction: column;
}

#right-content {
    background-color: var(--primary);
}

.banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    width: 100%;
    background-color: #f1f1f1;
}

#banner-picture {
    height: 150px;
    width: 100%;
    margin-left: -23px;
    margin-right: -23px;
}

#profile-picture {
    border: 5px solid white;
    border-radius: 50%;
    height: var(--profile-pic-size);
    width: var(--profile-pic-size);
    position: absolute;
    top: -40%;
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
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 30px;
}

#header-user-details-container {
    --profile-pic-size: 170px;
    flex: 1 0 auto;
    position: relative;
}

#header-user-details {
    margin-left: calc(var(--profile-pic-size) + 40px);
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

#header-user-school, #header-user-biography, #header-user-interests {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
}

#user-school, #user-biography {
    font-style: italic;
}

#header-user-actions {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
}

#sign-out-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
}
#sign-out-container {
    cursor: pointer;
}
#user-sign-out-icon, #user-sign-out-text {
    color: #dd1217;
    font-size: 1.2rem;
}

#user-edit-icon {
    font-size: 2rem;
    color: black;
}

#header-content-border-bottom {
    width: 80%;
    border-bottom: 1px solid lightgray;
    margin: 0 auto;
    margin-bottom: 30px;
}

#profile-page-content {
    width: 60%;
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

.follower-card {
    margin-top: 55px;
}

.forums-card {
    margin-top: 55px;
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

.card {
    margin-bottom: 20px;
    max-width: 97%;
    border-radius: 15px !important;
}

.three-dots {
    position: absolute;
    bottom: 0;
    margin-left: 5px;
    margin-bottom: 15px;
}

.card-position {
    height: 100%;
    position: relative;
}

.forum-name {
    margin-top: 25px;
    font-family: Quicksand;
    font-weight: lighter;
}

.forum-description {
    margin-top: -20px;
    font-weight: Quicksand;
    font-weight: medium;
}

#main-container {
    position: relative;
    min-height: 100vh;
}

#left-content {
    position: relative;
    padding: 0px;
}

.floating-button-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    margin-right: 22%;
    z-index: 9999;
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
}

.plus-icon {
    font-size: 24px;
}

.follow-btn {
    background-color: transparent;
    border: var(--primary) solid 3.5px;
    color: var(--primary);
    border-radius: 10px;
    height: 3rem;
    width: 9rem;
    transition: all 0.3s;
}

.follow-btn:hover {
    background-color: var(--primary);
    color: white;
}

.followed {
    background-color: var(--primary);
    color: white;
}

.followed:hover {
    background-color: transparent;
    color: var(--primary);
}

.msg-btn {
    display: flex;
    border-radius: 10px;
    height: 3rem;
    width: 9rem;
    align-items: center;
    padding-left: 25px;
    background-color: transparent;
    border: var(--dark) solid 3.5px;
    color: var(--dark);
    transition: all 0.3s;
}

.msg-btn:hover {
    background-color: var(--dark);
    color: white;
}

.msg-btn .material-symbols-outlined {
    color: var(--dark);
    font-size: 1.3rem;
    transition: all 0.3s;
}

.msg-btn:hover .material-symbols-outlined {
    color: white;
    opacity: 1;
}
</style>