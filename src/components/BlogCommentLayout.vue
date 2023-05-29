<template>
    <div class="comment-container container" v-if="!deleted">
        <div class="row comment-header">
            <!-- creator profile pic -->
            <div class="profile-pic-container col">
                <img class="profile-pic" :src="comment.creator_id.profile_pic_link"/>
            </div>

            <!-- creator username -->
            <div class="col-7 hide-overflow-text">
                <span>{{ comment.creator_id.username }}</span>
            </div>

            <!-- creation time (time difference) -->
            <div class="col comment-creation-time">
                <time :datetime="comment.creation_time" :title="new Date(comment.creation_time)">{{ dateCreated }}</time>
            </div>

            <!-- TODO check user rights -->
            <!-- only if the comment is posted by the current user -->
            <div class="col comment-privilege-actions" v-if="comment.isOwner">
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
        this.calcDateDifference();
    },
    methods: {
        // calculate difference between datetime when the comment was created and current datetime and show corresponding messages
        calcDateDifference() {
            const postDatetime = new Date(this.comment.creation_time);
            const currentDatetime = new Date();

            const timeDifference = currentDatetime.getTime() - postDatetime.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            if (dayDifference == 0) {
                this.dateCreated = 'Today';
            }
            else if (dayDifference == 1) {
                this.dateCreated = 'Yesterday';
            }
            else if (dayDifference < 30) {
                this.dateCreated = `${dayDifference} days ago`;
            }
            else {
                const monthDifference = Math.floor(dayDifference / 30);

                if (monthDifference < 12) {
                    this.dateCreated = `${monthDifference} month${monthDifference > 1 ? 's' : ''} ago`;
                }
                else {
                    const yearDifference = Math.floor(monthDifference / 12);
                    this.dateCreated = `${yearDifference} year${yearDifference > 1 ? 's' : ''} ago`;
                }
            }
        },
        // handle delete comment
        async deleteComment() {
            const confirmDelete = confirm('Are you sure you want to delete this comment?\n\nNote: This action is irreversible!');
            
            if (!confirmDelete) {
                return;
            }

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.postId}/comments/${this.comment._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (res.status == 200) {
                        this.deleted = true;
                    }

                    alert(data.message);
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
    align-items: center;
}

.comment-creation-time {
    text-align: end;
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