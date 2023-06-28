<template>
    <div class="thread-comment-container">
        <div class="thread-comment-header">
            <!-- creator profile pic -->
            <img class="thread-comment-profile-pic" :src="comment.creator_id.profile_pic_link" @click="viewUser" title="View user" />
            <div class="right-content">
                <!-- creator real name/username -->
                <div class="thread-comment-name-container" @click="viewUser" title="View user">
                    <span class="thread-comment-realname">{{ comment.creator_id.real_name }}</span>
                    <span class="thread-comment-username">@{{ comment.creator_id.username }}</span>
                </div>

                <!-- creation time -->
                <div class="thread-comment-creation-time-container">
                    <span :title="new Date(comment.creation_time)">{{ dateCreated }}</span>
                </div>
            </div>
        </div>

        <div class="thread-comment-content">
            <div class="blog-delete" title="Delete this post" v-if="userId == comment.creator_id._id">
                <span class="material-symbols-outlined deleteButton" @click="deletePost()">delete</span>
            </div>
            <p class="comment">{{ comment.content }}</p>
            
        </div>
    </div>
    <hr />
</template>

<script>
import calcDateDifference from '../../utils/general/calcDateDifference';
import viewUser from '../../utils/general/viewUser.js';

export default {
    data() {
        return {
            dateCreated: '',
            userId: '',
            // confirm: useConfirmStore().confirm,
        }
    },
    props: [
        'comment',
        'thread'
    ],
    created() {
        this.dateCreated = calcDateDifference(this.comment.creation_time);
        this.checkAuth();
        console.log(this.comment)
    },
    methods: {
        // to view profile of comment creator
        viewUser() {
            viewUser(this.comment.creator_id._id);
        },

        async checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.userId = data._id;
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                    })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        async deletePost(){
            // const confirmDelete = await this.confirm('Are you sure you want to delete this comment? This action is irreversible!');

            // if (!confirmDelete) {
            //     return;
            // }
            console.log(this.thread._id);
            console.log(this.comment._id);
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.thread._id}/${this.comment._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async (data) => {
                    
                });
            }).catch((error) => {
                console.log(error);
            });
        }

    }
}
</script>

<style>
.right-content {
    margin-left: 30px;
    width: 100%;
    display: flex;
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
    user-select: none;
    cursor: pointer;
}

.thread-comment-name-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.thread-comment-profile-pic:hover~div .thread-comment-name-container, .thread-comment-name-container:hover {
    color: var(--primary);
}

.thread-comment-creation-time-container{
    flex: 0 0 25%;
    text-align: right;
}

.thread-comment-realname {
    font-weight: bold;
}

.thread-comment-username {
    font-size: 0.8em;
}


.deleteButton{
    color: black;   
    float: right; 
}

hr {
    margin-top: 5px !important;
    margin-bottom: 5px !important
}
</style>