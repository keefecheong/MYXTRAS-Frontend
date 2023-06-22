<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" v-if="contentLoaded">
            <div class="row">
                <div class="imageContainer">
                    <img :src="forum.banner_link" alt="Banner" id="banner-picture"/>
                </div>
            </div>
            <div class="row">
                <div id="pink-container">
                    <div id="image" class="col-md-1">
                        <img class="imageIcon" :src="forum.forum_pic_link">
                    </div>
                    <div id="group-description" class="col-md-1">
                        <h5 id="groupname">x/{{ forum.forumID }}</h5>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-9">
                    <div class="card">
                        <div class="row threadContent">
                            <h2> {{ thread.thread_title}}</h2>
                            <h6> {{ thread.thread_desc}} </h6>
                        </div>
                        <div class="row">
                            <div id="threadImageContainer">
                                <img id="threadImage" :src="thread.content_links[0]">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="reactionContainer like-thread" :class="{liked:liked}">
                                    <span class="material-symbols-outlined reactionBtns" @click='toggleLike'>sentiment_very_satisfied</span><span>{{ likeCount }}</span>
                                    <span class="material-symbols-outlined reactionBtns" @click="toggleDisike">sentiment_very_dissatisfied</span><span>{{ dislikeCount }}</span>
                                </div>
                            </div>
                            <div class="col-6 d-flex justify-content-end">
                                <p>Posted by: @</p>
                                <br>
                                <p>{{thread.creator_id.username }}</p>
                                <img class="profilepic" :src="thread.creator_id.profile_pic_link" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                                <textarea placeholder="Anything Xtra to say?" style="width: 100%;" v-model="commentText"></textarea>
                            </div>
                            <div class="col-md-4">
                                <button @click="createComment">Comment</button>
                            </div>
                        </div>
                        <hr>
                    </div>
                </div>
                <div class="col-md-3">
                    <RecommendedForums />
                </div>
            </div>
            <div class="row" v-if="!commentsLoaded">
                <div v-for="comment in commentData">
                    <img :src="comment.creator_id.profile_pic_link" class="imageIcon">   
                    <p>{{ comment.creator_id.real_name }}</p>
                    <p>{{ '@' + comment.creator_id.username }}</p>
                    <p>{{comment.content }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import RecommendedForums from '../../components/forum/RecommendedForums.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
        RecommendedForums
    },
    data() {
        return {
            commentText: null,
            contentLoaded: false,
            commentsLoaded: false,
            forumID: null,
            forumGroupPic: null,
            forumBannerPic: null,
            current_threadID: null,
            submittingComment: false,
            commentData: {},
            liked_frontend: null,
            disliked_frontend: null,
            likeCount: null,
            dislikeCount: null,
            likeTimeout: null,
            dislikeTimeout: null,
        }
    },
    mounted() {
        this.getThreadPage()
        this.getComments()
    },
    methods: {
        async getThreadPage() {
            this.current_threadID = localStorage.getItem('threadID');
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-thread/${this.current_threadID}`, {
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
                this.thread = data.thread;
                console.log(this.thread)
                this.forum = data.forum;
                this.contentLoaded = true;

                this.liked = this.thread.liked;
                this.liked_frontend = this.liked;
                this.likeCount =  this.thread.likes.length;

                this.disliked = this.thread.disliked;
                this.disliked_frontend = this.disliked;
                this.dislikeCount =  this.thread.dislikes.length;
                
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        async createComment() {
            this.submittingComment = true;

            // do nothing if no content is entered
            if (this.commentText.trim().length <= 0) {
                this.submittingComment = false;
                return;
            }

            // upload comment
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.current_threadID}`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({
                    content: this.commentText.trim()
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.submittingComment = false;
                    alert(data.message);

                    // update comments list to update dom immediately
                    if (res.status == 200) {
                        this.thread.comments.push(data.comment._id);
                        this.commentData.push(data.comment);
                    }

                    this.commentText = '';
                });
            }).catch((error) => {
                console.log(error);
            })
        },
        async getComments() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.current_threadID}`, {
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
                this.commentData = data.comments;
                console.log(this.commentData)
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        toggleLike() {
            // toggle like on frontend only
            this.liked = !this.liked;
            this.liked_frontend = !this.liked_frontend;

            // update likeCount
            if (this.liked_frontend) {
                this.likeCount += 1;
                if (this.disliked_frontend) {
                    this.disliked_frontend = false
                    this.dislikeCount -= 1;
                }
            }
            else {
                this.likeCount -= 1;
            }

            // set timeout and only send request to update backend if user has not clicked the like button for 3 seconds
            clearTimeout(this.likeTimeout);

            this.likeTimeout = setTimeout(this.updateLike, 3000);
        },
        toggleDisike() {
            // toggle like on frontend only
            this.disliked = !this.disliked;
            this.disliked_frontend = !this.disliked_frontend
            
            // update dislikeCount
            if (this.disliked_frontend) {
                this.dislikeCount += 1;
                if (this.liked_frontend) {
                    this.liked_frontend = false
                    this.likeCount -= 1;
                }
            }
            else {
                this.dislikeCount -= 1;
            }
            // set timeout and only send request to update backend if user has not clicked the like button for 3 seconds
            clearTimeout(this.dislikeTimeout);

            this.dislikeTimeout = setTimeout(this.updateDislike, 3000);
        },
        // handle updating of like status to backend
        async updateLike() {
            // send request to update liked status
            if (this.liked_frontend) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/like/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 201) {
                        console.log('Liked.');
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
                if (this.disliked){
                    console.log('1')
                    this.disliked = false;
                    this.updateDislike()
                }
            }
            else {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/like/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 204) {
                        console.log('Removed like.');
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            
            this.likeTimeout = null;
        },
        async updateDislike() {
            
            // send request to update liked status
            if (this.disliked_frontend) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/dislike/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 201) {
                        console.log('Disiked.');
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
                if (this.liked){
                    this.liked = false;
                    this.updateLike()
                }
            }
            else {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/dislike/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 204) {
                        console.log('Removed dislike.');
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            
            this.likeTimeout = null;
        },
        // complete updateLike request if pending
        completeLikeRequest() {
            if (this.likeTimeout) {
                clearTimeout(this.likeTimeout);
                this.updateLike();
            }
        },
    },
}

</script>

<style>

@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
.like-thread.liked .material-symbols-outlined {
    color: red Im !important;
    font-variation-settings: 'FILL' 1;
}
.reactionContainer {
    display: inline-block;
}
.reactionBtns {
    
    color: black !important;
}
body {
    background-color: white !important;
    overflow-x: hidden;
}
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 0;
}
#group-description {
    display: flex;
    align-items: center; 
    justify-content: center;
    height: 10vh;
}
.threadContent {
    padding: 1em 4em;
}
#threadImageContainer {
    max-height: 50vh;
    display: flex;
    justify-content: center;
}
#threadImage{
    max-height: 100%;
    max-width: 100%;
}
/* .triangle {
  position: relative;
  height: 100px;
  width: 325px;
  background-color: var(--primary);
  border-radius: 25px 25px 25px 0;
}

.triangle::before {
  content: "";
  position: absolute;
  
  background-color: transparent;
  bottom: -50px;
  height: 50px;
  width: 25px;
  border-top-left-radius: 25px;
  box-shadow: 0 -25px 0 0 #F66969;
} */
#banner-picture {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    padding: 0 !important;
}
.imageIcon {
    float:left;
    overflow: hidden;
    width: 60px;
    height: 60px;
    margin-left: 150px;
    margin-right: 20px;
    border-radius: 50%;
}
#pink-container{
    background-color: var(--primary);
}
.group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;
    float: left;
}
.profilepic {
    overflow: hidden;
    width: 6vh;
    height: 6vh;
    margin-right: 20px;
    margin-top: 15px;
    border-radius: 50%;

}

.text-below-pic {
    margin-top: 5px;
}

</style>