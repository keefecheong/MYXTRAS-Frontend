<template>
    <div class="card shadow thread-layout-container">
        <div class="thread-layout-left">
            <img class="thread-profile-pic" :src="thread.creator_id.profile_pic_link" />
        </div>

        <div class="thread-layout-right">
            <div class="thread-layout-right-header">
                <div class="thread-layout-header-details">
                    <span class="thread-creator">Posted by: @{{ thread.creator_id.username }}</span>
                    <span class="thread-title">{{ thread.thread_title }}</span>
                    <InterestBadgeList v-if="thread.tags.length > 0" :selectedOption="thread.tags" :selection="false" title="Tags" />
                </div>

                <div class="thread-options">
                    <span class="material-symbols-outlined" v-if="thread.isOwner" @click="() => toggleThreadForm(true)">edit</span>
                </div>
            </div>

            <div class="thread-layout-right-content">
                <span class="thread-description">{{ thread.thread_desc }}</span>

                <img class="thread-picture" v-if="thread.content_links" :src="thread.content_links" />
            </div>

            <div class="thread-layout-right-comments">
                <span class="thread-show-comments" @click="viewComments">View comments ({{ numOfComments }})</span>
            </div>
        </div>
    </div>

    <ThreadFormLayout v-if="showThreadForm" :thread="thread" :editMode="true" @close-thread-form="() => toggleThreadForm(false)" />
</template>
<style>
@import url('../../styles/main.css');

.thread-layout-container {
    padding: 40px;
    display: flex;
    flex-direction: row !important;
    column-gap: 40px;
    align-items: start;
    margin-bottom: 60px;
}

.thread-profile-pic {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid gray;
}

.thread-layout-right {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.thread-layout-right-header {
    display: flex;
    flex-direction: row;
    column-gap: 50px;
    padding-bottom: 20px;
    border-bottom: 1px solid lightgray;
}

.thread-layout-header-details {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    align-items: start;
    width: 100%;
}

.thread-options .material-symbols-outlined {
    color: black;
    font-size: 1.5em;
}

.thread-creator {
    font-size: small;
}

.thread-title {
    font-weight: bolder;
    font-size: 1.8em;
}

.thread-layout-right-content {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
}

.thread-picture {
    max-width: 100%;
}

.thread-layout-right-comments {
    display: flex;
    justify-content: end;
}

.thread-show-comments {
    color: gray;
    cursor: pointer;
}

.thread-show-comments:hover {
    color: var(--primary);
}
</style>

<script>
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import ThreadFormLayout from './ThreadFormLayout.vue';

export default {
    data() {
        return {
            showThreadForm: false
        }
    },
    components: {
        InterestBadgeList,
        ThreadFormLayout
    },
    props: ['thread'],
    methods: {
        toggleThreadForm(show) {
            this.showThreadForm = show;
        },
        viewThread(thread) {
            sessionStorage.setItem("threadID", thread._id)
        }, 
    },
    computed: {
        numOfComments() {
            return this.thread.numOfComments;
        }
    }
}
</script>