<template>
    <div class="blog-container" :id="uniqueId" v-if="!deleted">
        <!-- heading - contains creator's profile pic, username, and time posted -->
        <div class="row blog-header">
            <!-- creator profile pic -->
            <div class="profile-pic-container col">
                <img class="profile-pic" :src="blog.creator_id.profile_pic_link"/>
            </div>

            <!-- creator username -->
            <div class="col-7 hide-overflow-text">
                <span>{{ blog.creator_id.username }}</span>
            </div>

            <!-- creation time (time difference) -->
            <div class="col blog-creation-time">
                <time :datetime="blog.creation_time" :title="new Date(blog.creation_time)">{{ dateCreated }}</time>
            </div>
        </div>

        <!-- content - contain images -->
        <div class="row blog-content">
            <div class="blog-image-container">
                <!-- one blog-item per image -->
                <div class="blog-item" v-for="(link, index) in blog.content_links" :class="{active: currentId == index + 1}">
                    <img class="blog-image" :src="link" />
                </div>

                <!-- show controls only if more than one image and the active image is not the first/last -->
                <a class="blog-prev" @click="prevSlide" v-if="showPrev">&#10094;</a>
                <a class="blog-next" @click="nextSlide" v-if="showNext">&#10095;</a>
            </div>

            <!-- show indicators only if more than one image, one indicator per image -->
            <div class="blog-indicator-container" v-if="blog.content_links.length > 1">
                <span class="blog-indicator" v-for="(value, index) in blog.content_links" :class="{active: currentId == index + 1}" :id="index + 1" @click="toggleSlide"></span>
            </div>
        </div>

        <!-- actions - contains like and comment -->
        <div class="row blog-actions">
            <!-- actions for all users -->
            <div class="blog-normal-actions row">
                <!-- like button -->
                <div class="like-blog col align-items-center justify-content-center" :class="{liked: liked}">
                    <span class="material-symbols-outlined" @click="toggleLike">favorite</span>
                    <span>({{ likeCount }})</span>
                </div>
                
                <!-- comments button -->
                <div class="col align-items-center justify-content-center">
                    <span class="material-symbols-outlined" @click="toggleComments">comment</span>
                    <span>({{ blog.comments.length }})</span>
                </div>
            </div>

            <!-- only if the blog is posted by the current user -->
            <div class="blog-privilege-actions row">
                <!-- edit button -->
                <div class="blog-edit col">
                    <RouterLink to="/edit" @click="editPost">
                        <span class="material-symbols-outlined">edit</span>
                    </RouterLink>
                </div>

                <!-- delete button -->
                <div class="blog-delete col">
                    <span class="material-symbols-outlined" @click="deletePost">delete</span>
                </div>
            </div>
        </div>

        <!-- comments - contains the comments posted -->
        <div v-if="showComments" class="row blog-comments-container">
            <!-- form to create new comment -->
            <form class="create-comment-form" @submit.prevent="createComment">
                <textarea class="create-comment-text" wrap="soft" placeholder="Add a comment..." v-model="commentText"></textarea>
                <hr />
                <input class="create-comment-button" type="submit" :value="submittingComment ? 'Creating...' : 'Create!'" :disabled="commentText.length <= 0 || submittingComment" />
            </form>

            <hr />

            <div v-if="blog.comments.length <= 0">
                <p>No comments yet, be the first!</p>
            </div>

            <div v-else>
                <div v-if="!commentsLoaded">
                    <p>Loading...</p>
                </div>

                <div v-else class="blog-comments-container">
                    <BlogCommentLayout v-for="comment in commentData.comments" :comment="comment" :postId="commentData._id" @commentDeleted="decreaseCommentCount" />
                </div>
            </div>
        </div>
    </div>

    <div class="blog-container" v-else>
        <p>Post deleted.</p>
    </div>
</template>

<style>
@import url('../styles/main.css');

/* container styles */
.blog-container {
    border: #133B5B;
    border-style: solid 1rem;
    margin: auto;
    width: 100%;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);;
    border-radius: 30px;
    padding: 50px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

/* blog header styles */
.blog-header {
    align-items: center;
}

.profile-pic-container {
    flex: 0 0 0% !important;
}

.profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 40px;
    width: 40px;
}

.hide-overflow-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.blog-creation-time {
    text-align: end;
}

/* blog content styles */
.blog-image-container {
    position: relative;
}

.blog-item {
    display: none;
}

.blog-item.active {
    display: inherit;
}

.blog-image {
    width: 100%;
}

/* Next & previous buttons */
.blog-prev, .blog-next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    padding: 16px;
    margin-top: -22px;
    color: white;
    font-weight: bold;
    transition: 0.6s ease;
    border-radius: 0 10px 10px 0 !important;
    user-select: none;
    text-decoration:none;
}

/* Position the "next button" to the right */
.blog-next {
    right: calc(var(--bs-gutter-x) * 0.5);
    border-radius: 10px 0 0 10px !important;
}

/* On hover, add a black background color with a little bit see-through */
.blog-prev:hover, .blog-next:hover {
    background-color: #f1f1f1;
    color: black;
}

/* blog indicator styles */
.blog-indicator-container {
    text-align: center;
}

.blog-indicator {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
}
  
.blog-indicator.active, .blog-indicator:hover {
    background-color: #717171;
}

/* blog action styles */
.blog-actions {
    position: relative;
}

.blog-actions .row {
    width: fit-content;
}

.blog-privilege-actions {
    position: absolute;
    right: 0;
}

.blog-actions .col {
    display: flex;
}

.blog-actions .material-symbols-outlined {
    color: black;
    font-variation-settings: 'FILL' 0;
    user-select: none;
    display: inline;
    margin-right: 5px;
}

/* set liked favorite icon to filled red */
.like-blog.liked .material-symbols-outlined {
    color: red;
    font-variation-settings: 'FILL' 1;
}

.blog-edit a {
    text-decoration: none;
}

/* comment section styles */
.blog-comments-container {
    padding: 10px;
}

.create-comment-form {
    padding: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    border-radius: 5px;
    margin-bottom: 10px;
    text-align: end;
}

.create-comment-text {
    resize: none;
    width: 100%;
    display: block;
    margin-bottom: 10px;
    
}

.create-comment-text, .create-comment-text:focus {
    outline: none;
    border: none;
}

.create-comment-button {
    height: fit-content;
}
</style>

<script>
import { RouterLink } from 'vue-router';
import { useBlogStore } from '../stores/BlogStore.js';
import BlogCommentLayout from './BlogCommentLayout.vue';

export default {
    data() {
        return {
            dateCreated: '',
            uniqueId: 'a' + this.blog._id,
            currentId: 1,
            showPrev: false,
            showNext: false,
            deleted: false,
            showComments: false,
            commentsLoaded: false,
            commentText: '',
            commentData: {},
            submittingComment: false,
            liked: false,
            likeTimeout: null,
            likeCount: 0
        }; 
    },
    components: {
        RouterLink,
        BlogCommentLayout
    },
    props: [
        'blog'
    ],
    mounted() {
        this.calcDateDifference();
        this.toggleControls();

        // initialize liked and likeCount values
        // TODO get user id and check in likes array
        // this.liked = this.blog.likes.indexOf() != -1;
        this.likeCount = this.blog.likes.length;
    },
    updated() {
        this.toggleControls();
        
        if (this.showComments) {
            if (!this.commentsLoaded) {
                this.getComments();
            }
        }
    },
    beforeUnmount() {
        // complete pending updateLike request before the 
        if (!this.likeTimeout) {
            this.updateLike();
        }
    },
    methods: {
        // show the next slide
        nextSlide() {
            // do nothing if the active image is the last image
            if (this.currentId == document.querySelectorAll(`#${this.uniqueId} .blog-content .blog-image-container .blog-item`).length) {
                return;
            }

            this.currentId += 1;
        },
        // show the previous slide
        prevSlide() {
            // do nothing if the active image is the first image
            if (this.currentId == '1') {
                return;
            }
            
            this.currentId -= 1;
        },
        // show the slide for the corresponding blog indicator
        toggleSlide(e) {
            // do nothing if the target image is the active image
            if (e.target.id == this.currentId) {
                return;
            }

            this.currentId = parseInt(e.target.id);
        },
        // set showPrev and showNext based on the currentId
        toggleControls() {
            // hide next control if the active image is the last image and show otherwise
            if (this.currentId == document.querySelectorAll(`#${this.uniqueId} .blog-content .blog-image-container .blog-item`).length) {
                this.showNext = false;
            }
            else {
                this.showNext = true;
            }


            // hide previous control if the active image is the first image and show otherwise
            if (this.currentId == 1) {
                this.showPrev = false;
            }
            else {
                this.showPrev = true;
            }
        },
        // calculate difference between datetime when the post was created and current datetime and show corresponding messages
        calcDateDifference() {
            const postDatetime = new Date(this.blog.creation_time);
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
        // toggle liking of blog
        toggleLike() {
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
            if (this.likeTimeout) {
                clearTimeout(this.likeTimeout);
            }

            this.likeTimeout = setTimeout(this.updateLike, 3000);
        },
        // handle updating of like status to backend
        updateLike() {
            // send request to update liked status
            if (this.liked) {
                // TODO add current user id to the end of request url
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/like/`, {
                    mode: 'cors',
                    method: 'DELETE'
                }).then((res) => {
                    if (res.status == 204) {
                        console.log('Removed like.');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/like`, {
                    mode: 'cors',
                    method: 'POST',
                    body: JSON.stringify({
                        // TODO get current user id and pass as creator_id
                        // creator_id: 
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((res) => {
                    if (res.status == 201) {
                        console.log('Liked.');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        // handle deleting post
        async deletePost() {
            // ask for confirmation
            const confirmDelete = confirm('Are you sure you want to delete this post?\n\nNote: This action is irreversible!');

            if (!confirmDelete) {
                return;
            }

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}`, {
                mode: 'cors',
                method: 'DELETE'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (res.status == 200) {
                        this.deleted = true;
                    }

                    alert(data.message);
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // handle edit post
        editPost() {
            // update the store to hold the current blog to edit
            const store = useBlogStore();
            store.blogToEdit = this.blog;
        },
        // retrieve comments for the post
        async getComments() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/comments`, {
                mode: 'cors',
                method: 'GET'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.commentData = data;

                    this.commentsLoaded = true;
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // toggle comments for the post
        toggleComments() {
            this.showComments = !this.showComments;
        },
        // create comment
        async createComment() {
            this.submittingComment = true;

            // do nothing if no content is entered
            if (this.commentText.length <= 0) {
                this.submittingComment = false;
                return;
            }

            // upload comment
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/comments`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({
                    // TODO get current user id and set as creator_id
                    creator_id: "6021fde84705d830b8f458ab",
                    content: this.commentText
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.submittingComment = false;
                    alert(data.message);

                    // update comments list to update dom immediately
                    if (res.status == 200) {
                        this.blog.comments.push(data.comment._id);
                        this.commentData.comments.push(data.comment);
                    }

                    this.commentText = '';
                });
            }).catch((error) => {
                console.log(error);
            })
        },
        // remove deleted comment's id from the comments list to update the dom immediately
        decreaseCommentCount(commentId) {
            this.blog.comments.splice(this.blog.comments.indexOf(commentId), 1);
        }
    }
}
</script>