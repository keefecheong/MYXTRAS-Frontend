<template>
    <div class="comment-container" v-if="!deleted">
        <div class="comment-header">
            <!-- creator profile pic -->
            <div class="profile-pic-container">
                <img class="profile-pic" :src="comment.creator_id.profile_pic_link"/>
            </div>

            <!-- creator username -->
            <div class="comment-username-container hide-overflow-text">
                <span>{{ comment.creator_id.username }}</span>
            </div>

            <!-- creation time (time difference) -->
            <div class="comment-creation-time">
                <time :datetime="comment.creation_time" :title="new Date(comment.creation_time)">{{ dateCreated }}</time>
            </div>

            <!-- only if the comment is posted by the current user -->
            <div class="comment-privilege-actions" v-if="comment.isOwner">
                <span class="material-symbols-outlined" @click="deleteComment">delete</span>
            </div>
        </div>

        <hr />

        <div class="row comment-content">
            <p>{{ comment.content }}</p>
        </div>
    </div>

    <div class="comment-container" v-else>
        <p>Comment deleted.</p>
    </div>
</template>

<script>
import calcDateDifference from '../../utils/general/calcDateDifference.js';
import { useAlertStore } from '../../stores/AlertStore.js';
import { useConfirmStore } from '../../stores/ConfirmStore.js';

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
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

/* comment header styles */
.comment-container {
    border-style:dotted;
    border-color: gray;
    border-width: 1px;
    margin-bottom: 10px;
    padding: 10px;
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
    margin-right: 5px;
}
</style>