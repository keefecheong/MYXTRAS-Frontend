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
                            <img :src="profilePicture" alt="Profile Picture" id="profile-picture" />

                            <div id="header-user-details">
                                <div id="header-user-name">
                                    <span id="user-realname">{{ realname }}</span>
                                    <span id="user-username">@{{ username }}</span>
                                </div>

                                <div id="header-user-school">
                                    <span>From the</span>
                                    <span id="user-school">School of {{ school }} - Diploma in {{ course }}</span>
                                </div>
                                
                                <div id="header-user-biography" v-if="biography != ''">
                                    <span>About me:</span>
                                    <span id="user-biography">{{ biography }}</span>
                                </div>

                                <div id="header-user-interests" v-if="selectedOption.length > 0">
                                    <span>Interested in: </span>
                                    <InterestBadgeList :selectedOption="selectedOption" :selection="false" />
                                </div>
                            </div>
                            
                        </div>

                        <div id="header-user-actions">
                            <a href="/profileManagement.html" v-if="!anotherUser">
                                <span id="user-edit-icon" class="bi bi-pencil"></span>
                            </a>
                            <button v-if="anotherUser" @click="followUser()">{{ followed ? 'Followed' : 'Follow' }}</button>

                            <div id="sign-out-container" @click="signOut()" v-if="!anotherUser">
                                <span id="user-sign-out-icon" class="bi bi-box-arrow-right"></span>
                                <span id="user-sign-out-text">Sign out</span>
                            </div>
                            <button v-if="anotherUser">Chat</button>
                        </div>
                    </div>

                    <div id="header-content-border-bottom"></div>

                    <div id="user-blog-container">
                        <BlogLayout v-for="blog in blogs" :blog="blog" />
                    </div>

                    <div class="content-wrapper">
                        <div class="floating-button" @click="() => { toggleCreateBlog(true) }">
                            <i style="color: white" class="bi bi-plus plus-icon"></i>
                        </div>
                    </div>
                </div>

                <div id="right-content" class="col-md-3">
                    <div class="card follower-card">
                        <div class="card-body card-position">
                            <h5 class="card-title">Followers: {{ followers.length }}</h5>
                            <div v-for="follower in followers" :key="follower.username">
                                <br>
                                <img class="profilepic" :src="follower.profilePic">
                                <p class="follower-username">{{ follower.username }}</p>
                                <br>
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
import profilePicture from '../../assets/NgeeAnnLogo.png';
import banner from '../../assets/CustomBanner.png';
import BlogLayout from '../../components/blog/BlogLayout.vue';
import BlogFormLayout from '../../components/blog/BlogFormLayout.vue';
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import ConfirmPrompt from '../../components/general/ConfirmPrompt.vue';

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
            anotherUser: false,
            followed: false,
            otherUser: '',
            banner: banner,
            profilePicture: profilePicture,
            realname: '',
            username: '',
            biography: '',
            school: '',
            course: '',
            selectedOption: [],
            blogs: [],
            followers: [],
            following: [],
            otherUserFollowers:[],
            forums: [
                { name: 'ILUVCats', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'We talk about cats' },
                { name: 'muggingclub', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'Gind never stops!' },
                { name: 'muggingclub', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'Gind never stops!' }
            ],
            showCreateBlog: false,
            follow: 'Follow',
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore()
        }
    },
    created() {
        this.getPosts();
        
        if (window.location.search == '?create') {
            this.showCreateBlog = true;
        }
    },

    mounted() {
        this.checkAuth();
        // this.populateFollowers();
        window.addEventListener('beforeunload', this.resetSessionStorage);
    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.resetSessionStorage);
    },

    methods: {
        checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.is_profile_setup === false) {
                            this.redirectsetup();
                            return;
                        }
                        else {
                            this.realname = data.real_name;
                            this.username = data.username;
                            this.biography = data.biography;
                            this.school = data.school;
                            this.course = data.course;
                            this.selectedOption = data.interests;
                            this.profilePicture = data.profile_pic_link;
                            this.following = data.following;
                            this.followers = data.followers;
                            this.userId = data._id;
                            this.checkStorage();
                        }
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        populateFollowers(){
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/followers`, {
                method: "GET",
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        console.log(data);
                        this.followers = data;
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        

        signOut() {
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/remove`, {
                method: 'GET',
                mode: "cors",
                credentials: 'include'
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/login.html';
                } else {
                    console.log("Error: Failed to log out (Remove cookie)")
                    console.log(response)
                }
            });
        },

        checkStorage(){
            this.otherUser = sessionStorage.getItem('user');
            if (this.otherUser != this.userId && this.otherUser != null){
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/${this.otherUser}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.realname = data.real_name;
                        this.username = data.username;
                        this.biography = data.biography;
                        this.school = data.school;
                        this.course = data.course;
                        this.selectedOption = data.interests;
                        this.profilePicture = data.profile_pic_link;
                        this.followers = data.followers;
                        this.anotherUser = true;
                        this.otherUser = data._id;
                        this.checkFollowing();
                        // this.getOtherPosts(this.otherUser);
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        },

        checkFollowing(){
            this.followed = this.following.includes(this.otherUser);
        },

        // get user's posts
        async getPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/self`, {
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
        },

        async getOtherPosts() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.otherUser}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    console.log(data);
                    this.blogs = data;
                });
            }).catch((error) => {
                console.log(error);
            });
        },

        async followUser(){
            if (this.following == 0){
                this.following.push(this.otherUser);
            }
            else{
                for (let i=0; i <= this.following.length; i++){
                    if (this.otherUser === this.following[i]){
                        const index = this.following.indexOf(this.otherUser);
                        if (index > -1) { // only splice array when item is found
                            this.following.splice(index, 1); // 2nd parameter means remove one item only
                        }
                        break;
                    }
                    else{
                        if (i+1 == this.following.length){
                            this.following.push(this.otherUser);
                        }
                    }
                }
            }
            this.userObject = {
                'following': this.following      
            };
            console.log(this.otherUser);
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/follow/${this.otherUser}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(this.userObject),
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    this.checkFollowing();
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                })
            
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

        resetSessionStorage() {
            sessionStorage.clear();
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
        }
    }

}

</script>

<style>
@import url('../../styles/main.css');

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

#right-content {
    background-color: var(--primary);
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

#user-blog-container {
    width: 60%;
    margin: 0 auto;
}

.follower-card {
    margin-top: 55px;
}

.forums-card {
    margin-top: 55px;
}

.profilepic {
    overflow: hidden;
    float: left;
    width: 65px;
    height: 65px;
    margin-right: 20px;
    margin-top: 15px;
    border-radius: 50%;
}

.follower-username {
    margin-top: 30px;
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

.content-wrapper {
    position: sticky;
    bottom: 20px;
    right: 20px;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
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
</style>