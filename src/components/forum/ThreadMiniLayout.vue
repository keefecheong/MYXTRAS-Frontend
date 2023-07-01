<template>
    <div class="card shadow thread-layout-container pinkHover" @click="showDetailedView" title="Click to view this thread" :id="index">
        <div class="thread-layout-left">
            <img class="thread-creator-profile-pic"
                :src="showForumDetails ? thread.parent_id.forum_pic_link : thread.creator_id.profile_pic_link"
            />
        </div>

        <div class="thread-layout-right">
            <div class="thread-layout-right-header">
                <div class="thread-layout-header-top">
                    <div>
                        <div class="thread-creator">
                            <span v-if="showForumDetails" @click.stop="viewForum" class="thread-layout-forum-name" title="View forum">x/{{ thread.parent_id.forum_id }} ~ </span>
                            <span class="thread-layout-creator-name" @click.stop="viewUser" title="View user">Posted by: @{{ thread.creator_id.username }}</span>
                        </div>
                        <span class="thread-title">{{ thread.title }}</span>
                    </div>

                    <div>
                        <span class="thread-datetime" :title="new Date(thread.creation_time)">{{ dateCreated }}</span>
                        <div class="thread-delete" title="Delete this post" >
                            <span class="material-symbols-outlined deleteButton" @click.stop="deleteThread()">delete</span>
                        </div>
                    </div>
                </div>

                <div class="thread-layout-header-bottom">
                    <div>
                        <InterestBadgeList v-if="thread.tags.length > 0" :selectedOption="thread.tags" :selection="false" title="Tags" />
                    </div>

                    <div class="thread-privileged-options">
                        <span class="material-symbols-outlined" v-if="thread.isOwner" @click.stop="() => toggleThreadForm(true)" title="Edit this thread">edit</span>
                    </div>
                </div>
            </div>

            <div class="thread-layout-right-content">
                <p class="thread-content hide-overflow-text">{{ thread.content }}</p>
            </div>
        </div>
    </div>

    <ThreadFormLayout v-if="showThreadForm" :thread="thread" :editMode="true" @close-thread-form="() => toggleThreadForm(false)" />
</template>

<script>
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import ThreadFormLayout from './ThreadFormLayout.vue';
import calcDateDifference from '../../utils/general/calcDateDifference';
import viewUser from '../../utils/general/viewUser.js';
import viewForum from '../../utils/general/viewForum.js';
import { useConfirmStore } from '../../stores/ConfirmStore.js';

export default {
    data() {
        return {
            showThreadForm: false,
            dateCreated: '',
            emits: ['deletedThread'],
            confirm: useConfirmStore().confirm,

        }
    },
    components: {
        InterestBadgeList,
        ThreadFormLayout
    },
    props: [
        'thread',
        'showForumDetails',
        'index'
    ],
    emits: [
        'show-detailed-view',
    ],
    created() {
        this.dateCreated = calcDateDifference(this.thread.creation_time);
    },
    methods: {
        // to show detailed view of thread
        showDetailedView() {
            this.$emit('show-detailed-view');
        },
        // to toggle thread form
        toggleThreadForm(show) {
            this.showThreadForm = show;
        },
        // to go to forumgroup for selected forum
        viewForum() {
            viewForum(this.thread.parent_id._id);
        },
        // to view profile of the user
        viewUser() {
            viewUser(this.thread.creator_id._id);
        },

        async deleteThread(){
            const confirmDelete = await this.confirm('Are you sure you want to delete this thread? This action is irreversible!');

            if (!confirmDelete) {
                return;
            }
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/${this.thread._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async (data) => {
                    window.location.reload();
                });
            }).catch((error) => {
                console.log(error);
            });
        },
    }
}
</script>

<style>
@import url('../../styles/forums/similar-thread-layout-styles.css');

.thread-layout-forum-name {
    color: rgb(0, 102, 204);
}

.pinkHover:hover {
    border: 3px solid var(--primary) !important;
}

.thread-content {
    --line-height: 1.5em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    line-height: var(--line-height);
    max-height: calc(var(--line-height) * 2);
    white-space: normal !important;
}

/* .deleteButton{
    color: black;   
    float: right; 
} */

</style>