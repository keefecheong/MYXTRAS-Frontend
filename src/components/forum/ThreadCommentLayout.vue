<template>
    <div class="thread-comment-container">
        <div class="thread-comment-header">
            <!-- creator profile pic -->
            <img class="thread-comment-profile-pic" :src="comment.creator_id.profile_pic_link" />
            <div class="right-content">
                <div class="top-content">
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
            </div>
        </div>

        <div class="thread-comment-content">
            <p>{{ comment.content }}</p>
        </div>
    </div>
    <hr />
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
.right-content {
    margin-left: 30px;
    width: 100%;
}
.thread-comment-content {
    margin-left: 30px;
}
.thread-comment-container {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;
    padding: 10px;
}

.thread-comment-header {
    display: flex;
    flex: 1 0 auto;
    position: relative;
    column-gap: 10px;
    align-items: center;
    padding-bottom: 10px;
}

.thread-comment-profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    border: 1px solid gray;
    position:absolute;
    top: 0px;
    left: -40px;
}
.top-content {
    display: flex;
}
.thread-comment-name-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.thread-comment-creation-time-container{
    flex: 1;
    text-align: right;
}
.thread-comment-realname {
    font-weight: bold;
}

.thread-comment-username {
    font-size: 0.8em;
}
hr {
    margin-top: 5px !important;
    margin-bottom: 5px !important
}
</style>