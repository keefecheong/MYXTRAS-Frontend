<template>
    <LoadingOverlay v-if="submittingComment || !dataInitialized" :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" />

    <div class="card shadow" id="thread-detailed-layout-container">
        <span v-if="showBackArrow" class="material-symbols-outlined" id="close-detailed-thread-container-arrow" title="Go back" @click="closeDetailedView">arrow_back</span>
        <span v-else class="material-symbols-outlined" id="close-detailed-thread-container-cross" title="Go back" @click="closeDetailedView">close</span>

        <div class="thread-layout-container" id="thread-detailed-layout-content">
            <!-- thread creator's profile pic -->
            <div class="thread-layout-left">
                <img class="thread-creator-profile-pic" :src="thread.creator_id.profile_pic_link" />
            </div>

            <div class="thread-layout-right">
                <div class="thread-layout-right-header">
                    <!-- thread creator, title, creation_time -->
                    <div class="thread-layout-header-top">
                        <div>
                            <div class="thread-creator">
                                <span>Posted by: @{{ thread.creator_id.username }}</span>
                            </div>

                            <span class="thread-title">{{ thread.title }}</span>
                        </div>

                        <div>
                            <span class="thread-datetime" :title="new Date(thread.creation_time)">{{ dateCreated }}</span>
                        </div>
                    </div>

                    <!-- thread tags and privileged options if user is creator -->
                    <div class="thread-layout-header-bottom">
                        <div>
                            <InterestBadgeList v-if="thread.tags.length > 0" :selectedOption="thread.tags" :selection="false" title="Tags" />
                        </div>

                        <div class="thread-privileged-options">
                            <span class="material-symbols-outlined" v-if="thread.isOwner" @click.stop="() => toggleThreadForm(true)" title="Edit this thread">edit</span>
                        </div>
                    </div>
                </div>

                <!-- thread content -->
                <div class="thread-layout-right-content">
                    <p id="thread-content">{{ thread.content }}</p>

                    <img id="thread-image" v-if="thread.content_link" :src="thread.content_link" alt="Thread Image" />
                </div>

                <!-- thread actions - like, dislike, comment -->
                <div id="thread-layout-right-actions">
                    <div id="thread-reaction-container">
                        <div id="like-thread-container">
                            <span class="material-symbols-outlined thread-reaction-button" :class="{liked: liked}" @click="toggleLike" title="Like this thread">sentiment_very_satisfied</span>
                            <span title="Number of likes">({{ likeCount }})</span>
                        </div>

                        <div id="dislike-thread-container">
                            <span class="material-symbols-outlined thread-reaction-button" :class="{disliked: disliked}" @click="toggleDisike" title="Dislike this thread">sentiment_very_dissatisfied</span>
                            <span title="Number of dislikes">({{ dislikeCount }})</span>
                        </div>
                    </div>

                    <div id="thread-comment-creation-container">
                        <form @submit.prevent="createComment">
                            <DynamicTextarea :id="'thread-comment-input'" :maxRows="4" :placeholder="'Add a comment...'" v-model="commentText"></DynamicTextarea>

                            <button type="submit" id="thread-comment-submit">Comment</button>
                        </form>
                    </div>
                </div>

                <!-- show thread comments -->
                <div id="thread-detailed-layout-comments-container">
                    <div v-if="comments.length > 0">
                        <h4>Comments ({{ comments.length }})</h4>
                        
                        <ThreadCommentLayout v-for="(comment, index) in comments" :comment="comment" :key="index" />
                    </div>
                    
                    <div v-else>
                        <p>No comments yet, be the first!</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import InterestBadgeList from '../general/InterestBadgeList.vue';
import ThreadCommentLayout from './ThreadCommentLayout.vue';
import { useAlertStore } from '../../stores/AlertStore';
import calcDateDifference from '../../utils/general/calcDateDifference';
import LoadingOverlay from '../general/LoadingOverlay.vue';
import DynamicTextarea from '../general/DynamicTextarea.vue';

export default {
    data() {
        return {
            comments: [],
            dateCreated: '',
            dataInitialized: false,

            alert: useAlertStore().alert,

            submittingComment: false,
            commentText: '',
            liked: false,
            savedLike: false,
            likeCount: 0,
            disliked: false,
            savedDislike: false,
            dislikeCount: 0,
            likeTimeout: null,
            dislikeTimeout: null
        }
    },
    props: [
        'thread',
        'showBackArrow'
    ],
    emits: [
        'close-detailed-view'
    ],
    components: {
        InterestBadgeList,
        ThreadCommentLayout,
        LoadingOverlay,
        DynamicTextarea
    },
    created() {
        // set like/dislike fields
        this.liked = this.thread.liked;
        this.savedLike = this.thread.liked;
        this.likeCount = this.thread.likes.length;
        this.disliked = this.thread.disliked;
        this.savedDislike = this.thread.disliked;
        this.dislikeCount = this.thread.dislikes.length;

        // get comment data
        this.initData();

        // get time difference from when thread was created and current datetime
        this.dateCreated = calcDateDifference(this.thread.creation_time);

        // set event listener to complete pending like/dislike requests when the page is closed
        window.addEventListener('beforeunload', this.completeRequests);
    },
    mounted() {
        // scroll to top
        window.scrollTo(0, 0);
    },
    beforeUnmount() {
        this.completeRequests();
    },
    watch: {
        // watch for changes in thread and update comments if thread id changes
        'thread._id': {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.initData();
                }
            }
        }
    },
    methods: {
        // to get comment data
        async initData() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.thread._id}`, {
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
                this.comments = data;
                this.dataInitialized = true;
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        // to close detailed view
        closeDetailedView() {
            this.$emit('close-detailed-view');
        },
        // to create comment
        async createComment() {
            this.submittingComment = true;

            // do nothing if no content is entered
            if (this.commentText.trim().length <= 0) {
                this.submittingComment = false;
                return;
            }

            // upload comment
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.thread._id}`, {
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
                        this.comments.push(data.comment);
                    }

                    this.commentText = '';
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // toggle like status of thread
        toggleLike() {
            // check if user currently dislikes the thread
            // if user dislikes the thread do nothing
            if (this.disliked) {
                this.alert('Remove dislike first.');
                return;
            }

            // toggle like on frontend only
            this.liked = !this.liked;

            // update likeCount
            if (this.liked) {
                this.likeCount += 1;
            }
            else {
                this.likeCount -= 1;
            }

            // set timeout and only send request to update backend if user has not clicked the like button for 3 seconds
            clearTimeout(this.likeTimeout);

            this.likeTimeout = setTimeout(this.updateLike, 3000);
        },
        // toggle dislike status of thread
        toggleDisike() {
            // check if user currently likes the thread
            // if user likes the thread do nothing
            if (this.liked) {
                this.alert('Remove like first.');
                return;
            }

            // toggle like on frontend only
            this.disliked = !this.disliked;
            
            // update dislikeCount
            if (this.disliked) {
                this.dislikeCount += 1;
            }
            else {
                this.dislikeCount -= 1;
            }

            // set timeout and only send request to update backend if user has not clicked the dislike button for 3 seconds
            clearTimeout(this.dislikeTimeout);

            this.dislikeTimeout = setTimeout(this.updateDislike, 3000);
        },
        // handle updating of like status to backend
        async updateLike() {
            // send request to update liked status
            if (this.liked && !this.savedLike) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/like/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 201) {
                        this.savedLike = true;
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            else if (!this.liked && this.savedLike) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/like/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 204) {
                        this.savedLike = false;
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
        // handle updating of dislike status to backend
        async updateDislike() {
            // send request to update liked status
            if (this.disliked && !this.savedDislike) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/dislike/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'POST',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 201) {
                        this.savedDislike = true;
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            else if (!this.disliked && this.savedDislike) {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/dislike/${this.thread._id}`, {
                    mode: 'cors',
                    method: 'DELETE',
                    credentials: 'include'
                }).then(async (res) => {
                    if (res.status == 204) {
                        this.savedDislike = false;
                    }
                    else {
                        await res.json().then(data => console.log(data));
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            
            this.dislikeTimeout = null;
        },
        // complete updateLike/updateDislike request if pending
        completeRequests() {
            if (this.likeTimeout) {
                clearTimeout(this.likeTimeout);
                this.updateLike();
            }
            
            if (this.dislikeTimeout) {
                clearTimeout(this.dislikeTimeout);
                this.updateDislike();
            }
        }
    }
}
</script>

<style>
@import url('../../styles/forums/similar-thread-layout-styles.css');

#thread-detailed-layout-content {
    cursor: auto;
    margin-bottom: 0;
}

#thread-detailed-layout-container > .material-symbols-outlined {
    user-select: none;
}

#close-detailed-thread-container-arrow {
    color: black;
    font-size: 2em;
    width: fit-content;
    position: absolute;
    top: 20px;
    left: -5%;
}

#close-detailed-thread-container-cross {
    color: black;
    font-size: 2em;
    width: fit-content;
    position: absolute;
    right: 2%;
    top: 2%;
}

#thread-image {
    max-width: 100%;
}

#thread-layout-right-actions {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid lightgray;
}

#thread-reaction-container {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    user-select: none;
}

#thread-reaction-container div {
    display: flex;
    flex-direction: row;
    column-gap: 5px;
    align-items: center;
}

.thread-reaction-button {
    color: black;
    font-size: 2em;
}

.thread-reaction-button.liked {
    color: var(--primary);
    font-variation-settings: 'FILL' 1;
}

.thread-reaction-button.disliked {
    color: var(--dark);
    font-variation-settings: 'FILL' 1;
}

#thread-comment-creation-container form {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: end;
}

#thread-comment-input {
    width: 100%;
    border-radius: 15px;
    padding: 15px;
    border: 1px solid lightgray;
}

#thread-comment-input:focus {
    border-color: black;
}

#thread-comment-submit {
    height: fit-content;
    padding: 10px 20px;
    border-radius: 15px;
    border: none;
    background-color: var(--primary);
    color: white;
}
#thread-comment-submit:hover {
    border: none;
    background-color: var(--secondary);
}
</style>