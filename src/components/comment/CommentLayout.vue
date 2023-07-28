<template>
    <div class="comment-container" :id="comment._id">
        <!-- creator profile pic -->
        <img class="comment-profile-pic" :src="comment.creator_id.profile_pic_link" @click="viewUser" title="View user"/>

        <div class="right-content">
            <div class="top-content">
                <!-- creator username -->
                <div class="comment-username-container hide-overflow-text" @click="viewUser" title="View user">
                    <span class="username-text">{{ comment.creator_id.username }}</span>
                </div>

                <!-- creation time (time difference) -->
                <div class="comment-creation-time">
                    <span :title="new Date(comment.creation_time)">{{ dateCreated }}</span>
                </div>

                <!-- only if the comment is posted by the current user -->
                <div class="comment-actions">
                    <span v-if="comment.isOwner" class="material-symbols-outlined" @click="deleteComment" title="Delete this comment">delete</span>
                    <span v-else class="report-button material-symbols-outlined" @click="reportComment" title="Report this comment">flag</span>
                </div>
            </div>

            <div class="bottom-content">
                <div class="row comment-content">
                    <p>{{ comment.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import calcDateDifference from '../../utils/general/calcDateDifference.js';
import { useAlertStore } from '../../stores/AlertStore.js';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import viewUser from '../../utils/general/viewUser.js';

export default {
    data() {
        return {
            dateCreated: ''
        }
    },
    props: [
        'forPost',
        'blogCreatorId',
        'postId',
        'forumId',
        'threadId',
        'comment'
    ],
    emits: [
        'comment-deleted',
        'report-comment'
    ],
    mounted() {
        // get time difference from when the comment was created and current datetime
        this.dateCreated = calcDateDifference(this.comment.creation_time);
    },
    methods: {
        // handle delete comment
        async deleteComment() {
            const confirmDelete = await useConfirmStore().confirm('Are you sure you want to delete this comment? This action is irreversible!');
            
            if (!confirmDelete) {
                return;
            }

            const url = this.forPost ? 
                `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/user/${this.blogCreatorId}/post/${this.postId}/comments/${this.comment._id}` : 
                `${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${this.forumId}/thread/${this.threadId}/comments/${this.comment._id}`;

            await fetch(url, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async(data) => {
                    await useAlertStore().alert(data.message);

                    if (res.ok) {
                        this.$emit('commentDeleted', this.comment._id);
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // view user profile of comment creator
        viewUser() {
            viewUser(this.comment.creator_id._id);
        },
        // to report comment
        reportComment() {
            this.$emit('report-comment');
        }
    }
}
</script>

<style>
.comment-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
    border-bottom: 1px solid lightgray;
    border-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 10px;
    transition: background-color 1s ease-out;
}

.comment-profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 48px;
    width: 48px;
    cursor: pointer;
    user-select: none;
}

.right-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    padding-top: 10px;
}

.top-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
}

.comment-username-container {
    flex-grow: 1;
    cursor: pointer;

    .username-text {
        text-decoration: underline;
    }
}

.comment-profile-pic:hover~div .username-text, .comment-username-container:hover .username-text {
    color: var(--primary);
}

.comment-creation-time {
    max-width: 30%;
}

.comment-actions {
    flex-grow: 0;
}

.comment-actions .material-symbols-outlined {
    color: black;
    font-variation-settings: 'FILL' 0;
    user-select: none;
    display: inline;
}
</style>