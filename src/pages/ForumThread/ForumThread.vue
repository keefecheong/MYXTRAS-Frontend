<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>
    
    <div id="main-container">
        <div id="main-content" v-if="contentLoaded">
            <div class="row">
                <ForumViewHeader
                    :forum="forum"
                    :isCreator="isCreator"
                    :isSubscribed="isSubscribed"
                    :showCreateThreadButton="false"
                    @show-forum-form="() => toggleForumForm(true)"
                />

                <div class="card">
                        <div class="row threadContent">
                            <h2> {{ thread.thread_title}}</h2>
                            <h6> {{ thread.thread_desc}} </h6>
                        </div>
                        <div class="row">
                            <div id="threadImageContainer">
                                <img id="threadImage" :src="thread.content_links">
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
            <div class="row" v-if="!commentsLoaded">
                <div v-for="comment in commentData">
                    <img :src="comment.creator_id.profile_pic_link" class="imageIcon">   
                    <p>{{ comment.creator_id.real_name }}</p>
                    <p>{{ '@' + comment.creator_id.username }}</p>
                    <p>{{comment.content }}</p>
                </div>
            </div>

            <ForumFormLayout v-if="showForumForm" :editMode="true" :forum="forum" @close-forum-form="() => toggleForumForm(false)" />
        </div>
    </div>

</template>

<script>
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import ForumViewHeader from '../../components/forum/ForumViewHeader.vue';
import ForumFormLayout from '../../components/forum/ForumFormLayout.vue';

export default {
    components: {
        AlertPrompt,
        ForumViewHeader,
        ForumFormLayout
    },
    data() {
        return {
            showForumForm: false,

            forum: null,
            isCreator: false,
            isSubscribed: false,
            commentText: null,
            contentLoaded: false,
            commentsLoaded: false,
            
            current_threadID: null,
            submittingComment: false,
            commentData: {},
            liked_frontend: null,
            disliked_frontend: null,
            likeCount: null,
            dislikeCount: null,
            likeTimeout: null,
            dislikeTimeout: null,

            alert: useAlertStore().alert,
            alertStore: useAlertStore()
        }
    },
    created() {
        this.initData()
    },
    methods: {
        // to toggle edit forum form
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        async initData() {
            // to get forum data
            const forumID = sessionStorage.getItem('forumID');

            const forumPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-forum/${forumID}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    console.log('An error occured');
                }
            })
            .then(data => {
                this.forum = data.forum;
                // Stores forumPic to be displayed in threadView.html
                this.isCreator = data.isCreator;
                this.isSubscribed = data.isSubscribed;
            })
            .catch((error) => {
                console.log(error);
            });

            // to get thread data
            this.current_threadID = sessionStorage.getItem('threadID');

            const threadPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-thread/${this.current_threadID}`, {
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
                this.thread = data;
                console.log(this.thread)

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

            const commentPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.current_threadID}`, {
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

            await Promise.all([forumPromise, threadPromise, commentPromise]).then(() => {
                this.contentLoaded = true;
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
                await res.json().then(async (data) => {
                    this.submittingComment = false;
                    await this.alert(data.message);

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