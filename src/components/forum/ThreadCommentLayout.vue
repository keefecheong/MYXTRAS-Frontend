<template>
    <div class="thread-comment-container">
        <div class="thread-comment-header">
            <!-- creator profile pic -->
            <div class="thread-comment-profile-pic-container">
                <img class="thread-comment-profile-pic" :src="comment.creator_id.profile_pic_link" />
            </div>

            <!-- creator real name/username -->
            <div class="thread-comment-name-container">
                <span class="thread-comment-realname">{{ comment.creator_id.real_name }}</span>
                <span class="thread-comment-username">@{{ comment.creator_id.username }}</span>
            </div>

            <!-- creation time -->
            <div class="thread-comment-creation-time-container">
                <span :title="new Date(comment.creation_time)">{{ dateCreated }}</span>
            </div>
        </div>

        <div class="thread-comment-content">
            <p>{{ comment.content }}</p>
        </div>
    </div>
</template>

<script>
import calcDateDifference from '../../utils/general/calcDateDifference';

export default {
    data() {
        return {
            dateCreated: ''
        }
    },
    props: [
        'comment'
    ],
    created() {
        this.dateCreated = calcDateDifference(this.comment.creation_time);
    }
}
</script>

<style>
.thread-comment-container {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;
    padding: 10px;
    border: 1px dotted gray;
    border-radius: 10px;
}

.thread-comment-header {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
}

.thread-comment-profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    border: 1px solid gray;
}

.thread-comment-name-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.thread-comment-realname {
    font-size: 1.2em;
}

.thread-comment-username {
    font-size: 0.8em;
}
</style>