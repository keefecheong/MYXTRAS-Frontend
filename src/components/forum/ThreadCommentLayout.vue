<template>
    <div class="thread-comment-container" :id="comment._id">
        <div class="thread-comment-header">
            <!-- creator profile pic -->
            <img
                class="thread-comment-profile-pic"
                :src="comment.creator_id.profile_pic_link"
                @click="viewUser"
                title="View user"
            />
            <div class="right-content">
                <!-- creator real name/username -->
                <div
                    class="thread-comment-name-container"
                    @click="viewUser"
                    title="View user"
                >
                    <span class="thread-comment-realname">{{
                        comment.creator_id.real_name
                    }}</span>
                    <span class="thread-comment-username"
                        >@{{ comment.creator_id.username }}</span
                    >
                </div>

                <!-- creation time -->
                <div class="thread-comment-creation-time-container">
                    <span :title="new Date(comment.creation_time)">{{
                        dateCreated
                    }}</span>
                </div>

                <!-- privileged operations -->
                <div
                    v-if="comment.isOwner"
                    class="privileged-thread-comment-actions"
                >
                    <span
                        class="material-symbols-outlined"
                        @click="deleteComment"
                        title="Delete this comment"
                        >delete</span
                    >
                </div>

                <!-- report button  -->
                <div v-else>
                    <span
                        class="material-symbols-outlined report-button"
                        @click="reportComment"
                        title="Report this comment"
                        >flag</span
                    >
                </div>
            </div>
        </div>

        <div class="thread-comment-content">
            <p class="comment">{{ comment.content }}</p>
        </div>
    </div>
    <hr />
</template>

<script>
import calcDateDifference from "../../utils/general/calcDateDifference";
import viewUser from "../../utils/general/viewUser.js";
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import { useAlertStore } from "../../stores/AlertStore";

export default {
    data() {
        return {
            dateCreated: "",
            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm,
        };
    },
    emits: ["deleted-comment", "report-comment"],
    props: ["comment", "thread"],
    created() {
        this.dateCreated = calcDateDifference(this.comment.creation_time);
    },
    methods: {
        // to view profile of comment creator
        viewUser() {
            viewUser(this.comment.creator_id._id);
        },
        // to delete comment
        async deleteComment() {
            const confirmDelete = await this.confirm(
                "Are you sure you want to delete this comment? This action is irreversible!",
            );

            if (!confirmDelete) {
                return;
            }
            await fetch(
                `${import.meta.env.VITE_APP_SERVER_URL}/api/threads/forum/${
                    this.thread.parent_id._id
                }/thread/${this.thread._id}/comments/${this.comment._id}`,
                {
                    mode: "cors",
                    method: "DELETE",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        this.alert(data.message);

                        this.$emit("deleted-comment");
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // to report comment
        reportComment() {
            this.$emit("report-comment", this.comment._id);
        },
    },
};
</script>

<style scoped>
.right-content {
    margin-left: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: center;
}

.privileged-thread-comment-actions .material-symbols-outlined {
    color: black;
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
    transition: background-color 1s ease-out;
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
    position: absolute;
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

.thread-comment-profile-pic:hover ~ div .thread-comment-name-container,
.thread-comment-name-container:hover {
    color: var(--primary);
}

.thread-comment-creation-time-container {
    flex: 0 0 25%;
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
    margin-bottom: 5px !important;
}
</style>
