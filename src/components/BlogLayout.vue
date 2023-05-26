<template>
    <div class="blog-container" :id="uniqueId" v-if="!deleted">
        <!-- heading - contains creator's profile pic, username, and time posted -->
        <div class="row blog-header">
            <!-- creator profile pic -->
            <div class="profile-pic-container col">
                <!-- change to creator profile pic when implemented -->
                <!-- <img class="profile-pic" :src="this.blog.creator_id.profile_pic_link"/> -->

                <img class="profile-pic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png" />
            </div>

            <!-- creator username -->
            <div class="col-7 hide-overflow-text">
                <!-- change to creator username when implemented -->
                <!-- <span>{{ this.blog.creator_id.username }}</span> -->

                <span>Bob</span>
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
            <div class="blog-indicator-container" v-if="multipleImages">
                <span class="blog-indicator" v-for="(value, index) in blog.content_links" :class="{active: currentId == index + 1}" :id="index + 1" @click="toggleSlide"></span>
            </div>
        </div>

        <!-- actions - contains like and comment -->
        <div class="row blog-actions">
            <!-- actions for all users -->
            <div class="blog-normal-actions row">
                <!-- like button -->
                <div class="like-blog col" :class="{liked: liked}" @click="toggleLike">
                    <span class="material-symbols-outlined">favorite</span>
                </div>
                
                <!-- comments button -->
                <div class="blog-comments col">
                    <span class="material-symbols-outlined">comment</span>
                </div>
            </div>

            <!-- only if the blog is posted by the current user -->
            <div class="blog-privilege-actions row">
                <!-- edit button -->
                <div class="blog-edit col">
                    <router-link to="/edit" @click="editPost">
                        <span class="material-symbols-outlined">edit</span>
                    </router-link>
                </div>

                <!-- delete button -->
                <div class="blog-delete col">
                    <span class="material-symbols-outlined" @click="deletePost">delete</span>
                </div>
            </div>
        </div>
    </div>

    <div class="blog-container" v-if="deleted">
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
    width: 80%;
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
    height: 500px;
    object-fit: cover;
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

.blog-actions .material-symbols-outlined {
    color: black;
    font-variation-settings: 'FILL' 0;
    user-select: none;
}

/* set liked favorite icon to filled red */
.like-blog.liked .material-symbols-outlined {
    color: red;
    font-variation-settings: 'FILL' 1;
}

.blog-edit a {
    text-decoration: none;
}
</style>

<script>
import { RouterLink } from 'vue-router';
import { useBlogStore } from '../stores/BlogStore.js';

export default {
    data() {
        return {
            dateCreated: '',
            uniqueId: 'a' + this.blog._id,
            currentId: 1,
            showPrev: false,
            showNext: false,
            deleted: false,
            updating: true
        }; 
    },
    components: {
        'router-link': RouterLink
    },
    props: [
        'blog'
    ],
    mounted() {
        this.calcDateDifference();
        this.toggleControls();
    },
    updated() {
        this.toggleControls();
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
        async toggleLike() {
            // send request to update liked status
            if (this.liked) {
                // TODO add current user id to the end of request url
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/like/`, {
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
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}/like`, {
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
                })
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
        }
    },
    computed: {
        // to check if the blog has multiple images
        multipleImages() {
            return this.blog.content_links.length > 1;
        },
        // to check if the current user has liked the image
        liked() {
            return false;  // dummy data until current user credentials can be checked

            // TODO get current user id and check in list of users who liked the post
        }
    }
}
</script>