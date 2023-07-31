<template>
    <LoadingOverlay v-if="submittingComment || !dataInitialized" :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" />

    <div class="card shadow" id="thread-detailed-layout-container">
        <span v-if="showBackArrow" class="material-symbols-outlined" id="close-detailed-thread-container-arrow" title="Go back" @click="closeDetailedView">arrow_back</span>
        <span v-else class="material-symbols-outlined" id="close-detailed-thread-container-cross" title="Go back" @click="closeDetailedView">close</span>

        <div class="thread-layout-container" id="thread-detailed-layout-content">
            <!-- thread creator's profile pic -->
            <div class="thread-layout-left">
                <img class="thread-creator-profile-pic"
                    :src="showForumDetails ? thread.parent_id.forum_pic_link : thread.creator_id.profile_pic_link"
                     @click="viewUser" title="View user"
                />
            </div>

            <div class="thread-layout-right">
                <div class="thread-layout-right-header">
                    <!-- thread creator, title, creation_time -->
                    <div class="thread-layout-header-top">
                        <div>
                            <div class="thread-creator">
                                <span v-if="showForumDetails" @click="viewForum" class="thread-layout-forum-name" title="View forum">x/{{ thread.parent_id.forum_id }} ~ </span>
                                <span class="thread-layout-creator-name" @click="viewUser" title="View user">Posted by: @{{ thread.creator_id.username }}</span>
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

                        <div class="thread-privileged-options" v-if="thread.isOwner">
                            <span class="material-symbols-outlined" @click="() => toggleThreadForm(true)" title="Edit this thread">edit</span>
                            <span class="material-symbols-outlined" @click="deleteThread" title="Delete this thread">delete</span>
                        </div>

                        <!-- report button -->
                        <div v-else>
                            <span class="material-symbols-outlined report-button" @click="() => toggleReportForm(true)" title="Report this thread">flag</span>
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
                            <DynamicTextarea :id="'thread-comment-input'" :maxRows="4" :placeholder="'Add a comment...'" v-model="commentText" />

                            <button type="submit" id="thread-comment-submit">Comment</button>
                        </form>
                    </div>
                </div>

                <!-- show thread comments -->
                <div id="thread-detailed-layout-comments-container">
                    <div v-if="comments.length > 0">
                        <h4>Comments ({{ comments.length }})</h4>
                        
                        <CommentLayout
                            v-for="(comment, index) in comments"
                            :key="index"
                            :comment="comment"
                            :threadId="thread._id"
                            :forumId="thread.parent_id._id"
                            :forPost="false"
                            @comment-deleted="() => handleDeletedComment(index)"
                            @report-comment="() => handleReportComment(comment._id)"
                        />
                    </div>
                    
                    <div v-else>
                        <p>No comments yet, be the first!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <ThreadFormLayout v-if="showThreadForm" :thread="thread" :editMode="true" @close-thread-form="() => toggleThreadForm(false)" />

    <ReportFormLayout
        v-if="showReportForm"
        :forumId="thread.parent_id._id"
        :threadId="thread._id"
        :commentId="reportCommentId"
        :type="reportType"
        @close-report-form="() => toggleReportForm(false)"
    />
</template>

<script>
import InterestBadgeList from '../general/InterestBadgeList.vue';

import { useAlertStore } from '../../stores/AlertStore';
import { useConfirmStore } from '../../stores/ConfirmStore.js';

import LoadingOverlay from '../general/LoadingOverlay.vue';
import DynamicTextarea from '../general/DynamicTextarea.vue';
import viewUser from '../../utils/general/viewUser.js';
import viewForum from '../../utils/general/viewForum.js';
import highlightElement from '../../utils/general/highlightElement.js';
import calcDateDifference from '../../utils/general/calcDateDifference.js';

import CommentLayout from '../comment/CommentLayout.vue';
import ThreadFormLayout from './ThreadFormLayout.vue';

import { debounce } from 'lodash';

import ReportFormLayout from '../report/ReportFormLayout.vue';

export default {
    data() {
        return {
            comments: [],
            dateCreated: '',
            dataInitialized: false,
            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm,

            submittingComment: false,
            commentText: '',
            liked: false,
            savedLike: false,
            likeCount: 0,
            disliked: false,
            savedDislike: false,
            dislikeCount: 0,
            debouncedLikeUpdate: null,
            debouncedDislikeUpdate: null,

            showThreadForm: false,

            showReportForm: false,
            reportType: null,
            reportCommentId: null
        }
    },
    props: [
        'thread',
        'showBackArrow',
        'showForumDetails',
        'highlightComment'
    ],
    emits: [
        'close-detailed-view'
    ],
    components: {
        InterestBadgeList,
        CommentLayout,
        LoadingOverlay,
        DynamicTextarea,
        ThreadFormLayout,
        ReportFormLayout
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
        this.initData().then(() => {
            if (this.highlightComment) {
                setTimeout(() => {
                    const targetComment = document.getElementById(this.highlightComment);

                    targetComment.scrollIntoView({
                        block: 'center'
                    });

                    highlightElement(targetComment);
                }, 300);
            }
        });

        // get time difference from when thread was created and current datetime
        this.dateCreated = calcDateDifference(this.thread.creation_time);

        // set debounce functions to only send requests to update backend if user has not clicked the like/dislike button for 3 seconds
        this.debouncedLikeUpdate = debounce(this.updateLike, 1000);
        this.debouncedDislikeUpdate = debounce(this.updateDislike, 1000);

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
    methods: {
        // to get comment data
        async initData() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.thread.parent_id._id}/thread/${this.thread._id}/comments`, {
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
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.thread.parent_id._id}/thread/${this.thread._id}/comments`, {
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
                        this.comments.unshift(data.comment);
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
            
            this.debouncedLikeUpdate();
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

            this.debouncedDislikeUpdate();
        },
        // handle updating of like status to backend
        async updateLike() {
            const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.thread.parent_id._id}/thread/${this.thread._id}/like`;
            const options = {
                mode: 'cors',
                credentials: 'include'
            }

            // send request to update liked status
            if (this.liked && !this.savedLike) {
                options.method = 'POST';

                await fetch(url, options).then(async (res) => {
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
                options.method = 'DELETE';

                await fetch(url, options).then(async (res) => {
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
        },
        // handle updating of dislike status to backend
        async updateDislike() {
            const url = `${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.thread.parent_id._id}/thread/${this.thread._id}/dislike`;
            const options = {
                mode: 'cors',
                credentials: 'include'
            }

            // send request to update liked status
            if (this.disliked && !this.savedDislike) {
                options.method = 'POST';

                await fetch(url, options).then(async (res) => {
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
                options.method = 'DELETE';

                await fetch(url, options).then(async (res) => {
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
        },
        // complete updateLike/updateDislike request if pending
        completeRequests() {
            this.debouncedLikeUpdate.flush();
            this.debouncedDislikeUpdate.flush();
        },
        // to go to forumgroup for parent forum
        viewForum() {
            viewForum(this.thread.parent_id._id);
        },
        // to view profile of the user
        viewUser() {
            viewUser(this.thread.creator_id._id);
        },
        // to update comments on deletion
        handleDeletedComment(index){
            this.comments.splice(index, 1);
        },
        // to delete thread
        async deleteThread(){
            const confirmDelete = await this.confirm('Are you sure you want to delete this thread? This action is irreversible!');

            if (!confirmDelete) {
                return;
            }

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.thread.parent_id._id}/thread/${this.thread._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async (data) => {
                    this.alert(data.message);
                    
                    location.reload();
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // to toggle thread form
        toggleThreadForm(show) {
            this.showThreadForm = show;
        },
        // to show/hide report form
        toggleReportForm(show, type='thread') {
            this.reportType = type;
            this.showReportForm = show;
        },
        // to report comment
        handleReportComment(commentId) {
            this.reportCommentId = commentId;

            this.toggleReportForm(true, 'threadComment');
        }
    }
}
</script>

<style>
@import url('../../styles/forums/similar-thread-layout-styles.css');

#thread-detailed-layout-container {
    transition: background-color 1s ease-out;
}

#thread-detailed-layout-content {
    cursor: auto;
    margin-bottom: 0;
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
    right: 10px;
    top: 10px;
}

#thread-content {
    word-break: break-all;
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
    color: black !important;
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
    word-break: normal;
}

#thread-comment-submit:hover {
    border: none;
    background-color: var(--secondary);
}

</style>