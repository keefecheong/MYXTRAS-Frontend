<template>
    <LoadingOverlay
        v-if="(showComments && !commentsLoaded) || submittingComment"
        :backgroundColor="'rgba(0, 0, 0, 0.5)'"
        :center="true"
    />

    <div class="blog-container" :id="blog._id" v-if="!deleted">
        <!-- heading - contains creator's profile pic, username, time posted, and location -->
        <div class="blog-header">
            <div>
                <!-- creator profile pic -->
                <img
                    class="blog-profile-pic"
                    :src="blog.creator_id.profile_pic_link"
                    @click="viewUser()"
                    title="View user"
                    :draggable="false"
                />

                <!-- creator username -->
                <span
                    class="blog-username hide-overflow-text"
                    title="View user"
                    @click="viewUser()"
                >
                    {{ blog.creator_id.username }}
                </span>

                <!-- creation time (time difference) -->
                <span
                    class="blog-creation-time"
                    :title="new Date(blog.creation_time)"
                >
                    {{ dateCreated }}
                </span>

                <!-- show if post is modified -->
                <span
                    v-if="modified"
                    class="blog-modified-label"
                    :title="new Date(blog.last_modified_time)"
                >
                    Edited
                </span>
            </div>

            <!-- tags and location -->
            <div
                class="blog-tags-and-location"
                :class="{
                    'location-only': !hasTags,
                    'tag-only': !blog.location,
                    'tag-and-location': hasTags && blog.location,
                }"
                v-if="showHeaderSecondRow"
            >
                <InterestBadgeList
                    v-if="hasTags"
                    :selectedOption="blog.tags"
                    :selection="false"
                    :maxWidth="'30%'"
                    class="blog-tags"
                    title="Tags"
                />
                <span
                    v-if="blog.location"
                    class="blog-location hide-overflow-text"
                    :title="blog.location"
                    >At {{ blog.location }}</span
                >
            </div>
        </div>

        <!-- content - contain images -->
        <div class="row blog-content">
            <div class="blog-image-container">
                <!-- one blog-item per image -->
                <div
                    class="blog-item"
                    v-for="(link, index) in blog.content_links"
                    :class="{ active: currentId == index + 1 }"
                >
                    <img class="blog-image" :src="link" />
                </div>

                <!-- show controls only if more than one image and the active image is not the first/last -->
                <a class="blog-prev" @click="prevSlide" v-if="showPrev"
                    >&#10094;</a
                >
                <a class="blog-next" @click="nextSlide" v-if="showNext"
                    >&#10095;</a
                >
            </div>

            <!-- show indicators only if more than one image, one indicator per image -->
            <div
                class="blog-indicator-container"
                v-if="blog.content_links.length > 1"
            >
                <span
                    class="blog-indicator"
                    v-for="(value, index) in blog.content_links"
                    :class="{ active: currentId == index + 1 }"
                    :id="index + 1"
                    @click="toggleSlide"
                ></span>
            </div>
        </div>

        <!-- caption -->
        <div class="row blog-caption">
            <span>{{ blog.caption }}</span>
        </div>

        <!-- actions - contains like and comment -->
        <!-- hide if user is blocked -->
        <div class="row blog-actions" v-if="!blog.blocked">
            <!-- actions for all users -->
            <div class="blog-normal-actions row">
                <!-- like button -->
                <div
                    class="like-blog col align-items-center justify-content-center"
                >
                    <span
                        class="material-symbols-outlined"
                        :class="{ liked: liked }"
                        @click="toggleLike"
                        :title="liked ? 'Remove like' : 'Like this post'"
                    >
                        favorite
                    </span>
                    <span title="Number of likes">({{ likeCount }})</span>
                </div>

                <!-- comments button -->
                <div class="col align-items-center justify-content-center">
                    <span
                        class="material-symbols-outlined"
                        :class="{ disabled: !blog.comments_enabled }"
                        @click="toggleComments"
                        :title="commentTitle"
                    >
                        comment
                    </span>
                    <span
                        title="Number of comments"
                        v-if="blog.comments_enabled"
                        >({{ blog.comment_count }})</span
                    >
                </div>

                <!-- save button -->
                <div class="col align-items-center justify-content-center">
                    <span
                        class="material-symbols-outlined"
                        :class="{ saved: saved }"
                        @click="toggleSave"
                        :title="
                            saved ? 'Remove from saved posts' : 'Save this post'
                        "
                    >
                        bookmark
                    </span>
                </div>
            </div>

            <div class="blog-other-actions">
                <!-- privilege actions only if the blog is posted by the current user -->
                <div v-if="blog.isOwner">
                    <!-- edit button -->
                    <div class="blog-edit" title="Edit this post">
                        <span
                            class="material-symbols-outlined"
                            @click="() => editPost(true)"
                            >edit</span
                        >
                    </div>

                    <!-- delete button -->
                    <div class="blog-delete" title="Delete this post">
                        <span
                            class="material-symbols-outlined"
                            @click="deletePost"
                            >delete</span
                        >
                    </div>
                </div>

                <!-- report button shown otherwise -->
                <div v-else>
                    <!-- report button -->
                    <span
                        class="report-button material-symbols-outlined"
                        @click="() => toggleReportForm(true)"
                        title="Report this post"
                        >flag</span
                    >
                </div>
            </div>
        </div>

        <!-- comments - contains the comments posted -->
        <div
            v-if="!blog.blocked && showComments && blog.comments_enabled"
            class="row blog-comments-container"
        >
            <!-- form to create new comment -->
            <form class="create-comment-form" @submit.prevent="createComment">
                <DynamicTextarea
                    v-model="commentText"
                    :placeholder="'Add a comment...'"
                    :maxRows="5"
                />
                <hr />
                <div class="create-comment-submit-container">
                    <input
                        class="create-comment-button"
                        type="submit"
                        :value="submittingComment ? 'Creating...' : 'Create!'"
                        :disabled="
                            commentText.trim().length <= 0 || submittingComment
                        "
                    />
                </div>
            </form>

            <hr />

            <div v-if="blog.comment_count <= 0">
                <p>No comments yet, be the first!</p>
            </div>

            <div v-if="commentsLoaded" class="blog-comments-container">
                <CommentLayout
                    v-for="(comment, index) in commentData"
                    :comment="comment"
                    :blogCreatorId="blog.creator_id._id"
                    :postId="blog._id"
                    :forPost="true"
                    :key="comment._id"
                    @comment-deleted="() => deleteComment(index)"
                    @report-comment="() => handleReportComment(index)"
                />
            </div>
        </div>
    </div>

    <div class="blog-container" v-else>
        <p>Post deleted.</p>
    </div>

    <BlogFormLayout
        v-if="blog.isOwner && editMode"
        :editMode="true"
        :blog="blog"
        @close-blog-form="() => editPost(false)"
    />

    <ReportFormLayout
        v-if="(!blog.isOwner || !reportComment?.isOwner) && showReportForm"
        :userId="blog.creator_id._id"
        :postId="blog._id"
        :commentId="reportComment?._id"
        :type="reportType"
        @close-report-form="() => toggleReportForm(false)"
    />
</template>

<style>
/* container styles */
.blog-container {
    margin: auto;
    width: 100%;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);
    border-radius: 30px;
    padding: 50px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    transition: background-color 1s ease-out;
}

/* blog header styles */
.blog-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 10px;
}

.blog-header > div {
    display: flex;
    flex-direction: row;
    width: 100%;
    column-gap: 15px;
    align-items: center;
}

.blog-profile-pic,
.blog-username {
    cursor: pointer;
}

.blog-profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: clamp(35px, 5dvw, 50px);
    width: clamp(35px, 5dvw, 50px);
}

.blog-username {
    flex: 1 0 auto;
}

.blog-profile-pic:hover ~ .blog-username,
.blog-username:hover {
    color: var(--primary);
}

.blog-modified-label {
    font-style: italic;
}

.blog-tags-and-location.location-only {
    justify-content: end;
}

.blog-tags-and-location.tag-only {
    justify-content: start;
}

.blog-tags-and-location.tag-and-location {
    justify-content: space-between;
}

.blog-location {
    max-width: 60%;
}

.blog-caption {
    border-bottom: 1px solid lightgray;
    font-style: italic;
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
.blog-prev,
.blog-next {
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
    text-decoration: none;
    background-color: #f1f1f1;
    color: black;
    opacity: 50%;
}

/* Position the "next button" to the right */
.blog-next {
    right: calc(var(--bs-gutter-x) * 0.5);
    border-radius: 10px 0 0 10px !important;
}

/* On hover, add a black background color with a little bit see-through */
.blog-prev:hover,
.blog-next:hover {
    background-color: #f1f1f1;
    color: black;
    opacity: 100%;
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

.blog-indicator.active,
.blog-indicator:hover {
    background-color: #717171;
}

/* blog action styles */
.blog-actions {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    --bs-gutter-x: 0 !important;
    margin: 0 !important;

    > * > * {
        padding: 0 !important;
    }
}

.blog-other-actions,
.blog-normal-actions {
    width: fit-content !important;
}

.blog-other-actions > div,
.blog-normal-actions {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
}

.blog-actions .col {
    display: flex;
}

.blog-normal-actions {
    column-gap: 15px;
}

.blog-actions .material-symbols-outlined {
    color: black;
    font-variation-settings: "FILL" 0;
    user-select: none;
    display: inline;
    margin-right: 2px;
    font-size: 1.5em;
}

/* set liked favorite icon to filled red */
.liked.material-symbols-outlined {
    color: red;
    font-variation-settings: "FILL" 1;
}

/* set saved bookmark icon to filled black */
.saved.material-symbols-outlined {
    color: black;
    font-variation-settings: "FILL" 1;
}

/* style disabled comments button */
.blog-actions .material-symbols-outlined.disabled {
    color: lightgray;
}

.blog-actions .material-symbols-outlined.disabled:hover {
    opacity: 1;
    cursor: not-allowed;
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
}

.create-comment-submit-container {
    position: relative;
    width: fit-content;
    left: 100%;
    transform: translateX(-100%);
}

.create-comment-button {
    height: fit-content;
    padding: 10px 20px;
    border-radius: 15px;
    border: none;
    background-color: var(--primary);
    color: white;
}
.create-comment-button:hover {
    border: none;
    background-color: var(--secondary);
}
</style>

<script>
import { RouterLink } from "vue-router";
import CommentLayout from "../comment/CommentLayout.vue";
import calcDateDifference from "../../utils/general/calcDateDifference.js";
import BlogFormLayout from "./BlogFormLayout.vue";
import LoadingOverlay from "../general/LoadingOverlay.vue";
import InterestBadgeList from "../general/InterestBadgeList.vue";
import { useAlertStore } from "../../stores/AlertStore.js";
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import DynamicTextarea from "../general/DynamicTextarea.vue";
import viewUser from "../../utils/general/viewUser.js";
import { debounce } from "lodash";
import ReportFormLayout from "../report/ReportFormLayout.vue";
import highlightElement from "../../utils/general/highlightElement.js";

export default {
    data() {
        return {
            currentId: 1,
            showPrev: false,
            showNext: false,

            dateCreated: "",
            modified: false,
            caption: "",
            deleted: false,

            showComments: false,
            commentsLoaded: false,
            commentText: "",
            commentData: [],
            submittingComment: false,

            likeCount: 0,
            savedLike: false,
            liked: false,
            debouncedLikeUpdate: null,

            savedSaved: false,
            saved: false,
            debouncedSaveUpdate: null,

            editMode: false,

            showReportForm: false,
            reportType: null,
            reportComment: null,

            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm,
        };
    },
    components: {
        RouterLink,
        CommentLayout,
        BlogFormLayout,
        LoadingOverlay,
        InterestBadgeList,
        DynamicTextarea,
        ReportFormLayout,
    },
    props: ["blog", "highlightComment"],
    created() {
        // if to highlight comment then start loading comments first
        if (this.highlightComment) {
            this.showComments = true;

            this.getComments();
        }
    },
    mounted() {
        // get time difference from when post was created and current datetime
        this.dateCreated = calcDateDifference(this.blog.creation_time);

        // check if the post is modified
        if (this.blog.creation_time != this.blog.last_modified_time) {
            this.modified = true;
        }

        // setup controls if there is more than one picture
        this.toggleControls();

        // initialize liked and likeCount values
        this.savedLike = this.blog.liked;
        this.liked = this.blog.liked;
        this.likeCount = this.blog.likes;

        // initialize saved value
        this.savedSaved = this.blog.saved;
        this.saved = this.blog.saved;

        // if to highlight comment then scroll to and highlight comment
        if (this.highlightComment) {
            setTimeout(() => {
                const targetComment = document.getElementById(
                    this.highlightComment,
                );

                if (targetComment) {
                    targetComment.scrollIntoView({
                        block: "center",
                    });
                }

                highlightElement(targetComment);
            }, 300);
        }

        // debounce function to only send request to update backend if user has not clicked the like/save button for 3 seconds
        this.debouncedLikeUpdate = debounce(this.updateLike, 3000);
        this.debouncedSaveUpdate = debounce(this.updateSave, 3000);

        // set event listener to complete pending requests when the page is closed
        window.addEventListener("beforeunload", () => {
            this.completeLikeRequest();
            this.completeSaveRequest();
        });
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
        this.completeLikeRequest();
        this.completeSaveRequest();
    },
    methods: {
        // show the next slide
        nextSlide() {
            // do nothing if the active image is the last image
            if (this.currentId == this.blog.content_links.length) {
                return;
            }

            this.currentId += 1;
        },
        // show the previous slide
        prevSlide() {
            // do nothing if the active image is the first image
            if (this.currentId == "1") {
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
            if (this.currentId == this.blog.content_links.length) {
                this.showNext = false;
            } else {
                this.showNext = true;
            }

            // hide previous control if the active image is the first image and show otherwise
            if (this.currentId == 1) {
                this.showPrev = false;
            } else {
                this.showPrev = true;
            }
        },
        // toggle liking of blog
        toggleLike() {
            // toggle like on frontend only
            this.liked = !this.liked;

            // update likeCount
            if (this.liked) {
                this.likeCount += 1;
            } else {
                this.likeCount -= 1;
            }

            this.debouncedLikeUpdate();
        },
        // handle updating of like status to backend
        async updateLike() {
            const targetURL = `${
                import.meta.env.VITE_APP_SERVER_URL
            }/api/posts/user/${this.blog.creator_id._id}/post/${
                this.blog._id
            }/likes`;
            const options = {
                mode: "cors",
                credentials: "include",
            };

            // send request to update liked status
            // only send to add like if new like value is true and currently saved like value is false
            if (this.liked && !this.savedLike) {
                options.method = "POST";

                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 201) {
                            this.savedLike = true;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            // only send to remove like if new like value is false and currently saved like value is true
            else if (!this.liked && this.savedLike) {
                options.method = "DELETE";

                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 204) {
                            this.savedLike = false;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        // complete updateLike request if pending
        completeLikeRequest() {
            this.debouncedLikeUpdate.flush();
        },
        // toggle saving of blog
        toggleSave() {
            // toggle save on frontend only
            this.saved = !this.saved;
            this.debouncedSaveUpdate();
        },
        // handle updating of save status to backend
        async updateSave() {
            const targetURL = `${
                import.meta.env.VITE_APP_SERVER_URL
            }/api/posts/user/${this.blog.creator_id._id}/post/${
                this.blog._id
            }/save`;
            const options = {
                mode: "cors",
                credentials: "include",
            };
            // send request to update save status
            // only send to save post if new saved value is true and currently saved saved value is false
            if (this.saved && !this.savedSaved) {
                options.method = "POST";
                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 201) {
                            this.savedSaved = true;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            // only send to remove post from saved if new saved value is false and currently saved saved value is true
            else if (!this.saved && this.savedSaved) {
                options.method = "DELETE";
                await fetch(targetURL, options)
                    .then(async (res) => {
                        if (res.status == 204) {
                            this.savedSaved = false;
                        } else {
                            await res.json().then((data) => console.log(data));
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        // complete updateSave request if pending
        completeSaveRequest() {
            this.debouncedSaveUpdate.flush();
        },
        // handle deleting post
        async deletePost() {
            // ask for confirmation
            const confirmDelete = await this.confirm(
                "Are you sure you want to delete this post? This action is irreversible!",
            );

            if (!confirmDelete) {
                return;
            }

            await fetch(
                `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/user/${
                    this.blog.creator_id._id
                }/post/${this.blog._id}`,
                {
                    mode: "cors",
                    method: "DELETE",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        if (res.status == 200) {
                            this.deleted = true;
                        }

                        await this.alert(data.message);
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // toggle edit post
        editPost(show) {
            this.editMode = show;
        },
        // retrieve comments for the post
        async getComments() {
            await fetch(
                `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/user/${
                    this.blog.creator_id._id
                }/post/${this.blog._id}/comments`,
                {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.commentData = data;

                        this.commentsLoaded = true;
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // toggle comments for the post if comments are enabled
        toggleComments() {
            if (this.blog.comments_enabled) {
                this.showComments = !this.showComments;
            }
        },
        // create comment
        async createComment() {
            this.submittingComment = true;

            // do nothing if no content is entered
            if (this.commentText.trim().length <= 0) {
                this.submittingComment = false;
                return;
            }

            // upload comment
            await fetch(
                `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/user/${
                    this.blog.creator_id._id
                }/post/${this.blog._id}/comments`,
                {
                    mode: "cors",
                    method: "POST",
                    body: JSON.stringify({
                        content: this.commentText.trim(),
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        this.submittingComment = false;
                        await this.alert(data.message);

                        // update comments list to update dom immediately
                        if (res.status == 200) {
                            this.blog.comment_count += 1;
                            this.commentData.unshift(data.comment);
                        }

                        this.commentText = "";
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // remove deleted comment's id from the comments list to update the dom immediately
        deleteComment(index) {
            this.blog.comment_count -= 1;

            this.commentData.splice(index, 1);
        },
        // go to profile page to view the creator's profile
        viewUser() {
            // only redirect if not already at profile page
            if (location.pathname != "/profilePage.html") {
                viewUser(this.blog.creator_id._id);
            }
        },
        // toggle report form
        toggleReportForm(show, type = "post") {
            this.showReportForm = show;
            this.reportType = type;
        },
        // to report comment
        handleReportComment(index) {
            this.reportComment = this.commentData[index];

            this.toggleReportForm(true, "postComment");
        },
    },
    computed: {
        // generate tooltip text for comment button
        commentTitle() {
            if (this.blog.comments_enabled) {
                return this.showComments ? "Hide comments" : "Show comments";
            } else {
                return "Comments disabled for this post";
            }
        },
        // check if the blog has tags
        hasTags() {
            return this.blog.tags.length > 0;
        },
        // check if the blog has tags or location to decide whether to show this part of the header
        showHeaderSecondRow() {
            return this.hasTags || this.blog.location;
        },
    },
};
</script>
