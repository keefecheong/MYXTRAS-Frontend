<template>
    <div class="comment-container" v-if="!deleted">
        <div class="comment-header">
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
                    <div class="comment-privilege-actions" v-if="comment.isOwner">
                        <span class="material-symbols-outlined" @click="deleteComment">delete</span>
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="row comment-content">
                        <p>{{ comment.content }}</p>
                    </div>
                </div>
            </div>
        </div>
        <hr />
    </div>

    <div class="comment-container" v-else>
        <p>Comment deleted.</p>
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
            dateCreated: '',
            deleted: false
        }
    },
    props: [
        'postId',
        'comment'
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

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/comments/${this.postId}/${this.comment._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async(data) => {
                    if (res.status == 200) {
                        this.deleted = true;
                    }

                    await useAlertStore().alert(data.message);
                    this.$emit('commentDeleted', this.comment._id);
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // view user profile of comment creator
        viewUser() {
            viewUser(this.comment.creator_id._id);
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');
#username-text {
    font-weight: bold;
}

.right-content {
    margin-left: 30px;
    width: 100%;
}

.top-content {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    margin-bottom: 10px;
}

.comment-header {
    position:relative;
}

.comment-profile-pic {
    position:absolute;
    top: 20px;
    left: -25px;
    border-radius: 100%;
    object-fit: cover;
    height: 40px;
    width: 40px;
    cursor: pointer;
    user-select: none;
}

/* comment header styles */
.comment-container {
    border-width: 1px;
    border-radius: 10px;
}

.comment-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 15px;
}

.comment-username-container {
    flex: 1 0 auto;
    cursor: pointer;
}

.comment-profile-pic:hover~div .username-text, .comment-username-container:hover .username-text {
    color: var(--primary);
}

.comment-creation-time {
    max-width: 30%;
}

.comment-privilege-actions {
    flex: 0 0 0% !important;
}

.comment-privilege-actions .material-symbols-outlined {
    color: black;
    font-variation-settings: 'FILL' 0;
    user-select: none;
    display: inline;
    margin-left: 15px;
    margin-right: 5px;
}

hr {
    margin-top: 5px !important;
    margin-bottom: 5px !important
}
</style>