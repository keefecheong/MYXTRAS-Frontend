<!-- standardized forum header (includes banner and header with forum details and edit forum, subscribe, and create thread buttons) -->

<template>
    <img :src="forum.banner_link" alt="Banner" id="banner-picture"/>

    <div id="forum-header-container">
        <div id="forum-header-above">
            <img id="group-icon" :src="forum.forum_pic_link">
            
            <div id="forum-header-above-name">
                <span id="group-name">{{forum.forumName}}</span>
                <span id="group-id">x/{{forum.forumID}}</span>
            </div>
        </div>
            
        <div id="forum-header-below">
            <div id="group-description">
                <span>Description: </span>
                <span class="hide-overflow-text">{{forum.forumDesc}}</span>
            </div>

            <div id="forum-header-subscribers">
                <span>{{"Subscribers: " + numOfSubs}}</span>
            </div>

            <div id="forum-options">
                <div id="privileged-options">
                    <button v-if="isCreator" @click="showForumForm">
                        <span class="material-symbols-outlined">Edit</span>
                    </button>
                </div>

                <div id="normal-options">
                    <button :class="{ 'subscribed': isSubscribed, 'white-btn': !isSubscribed  }" v-if="!isCreator" @click="subscribeForum">
                        {{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}
                    </button>

                    <button v-if="showCreateThreadButton" @click="showCreateThread" class="white-btn">Create Thread!</button>
                </div>
            </div>
        </div>

        <div id="forum-header-below-tags" v-if="forum.tags.length > 0">
            <span>Tags: </span>
            <InterestBadgeList :selectedOption="forum.tags" :selection="false" />
        </div>
    </div>
</template>

<script>
import InterestBadgeList from '../general/InterestBadgeList.vue';

export default {
    props: [
        'forum',
        'isCreator',
        'isSubscribed',
        'showCreateThreadButton'
    ],
    emits: [
        'show-forum-form',
        'show-thread-form',
        'subscribe'
    ],
    components: {
        InterestBadgeList
    },
    methods: {
        // to show edit forum form
        showForumForm() {
            this.$emit('show-forum-form');
        },
        // to show create thread form
        showCreateThread() {
            this.$emit('show-thread-form');
        },
        // to subscribe/unsubscribe from forum
        subscribeForum() {
            this.$emit('subscribe');
        }
    },
    computed: {
        numOfSubs() {
            return this.forum.subscribers.length
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

#banner-picture {
    width: 100%;
    height: 150px;
    object-fit: cover;
    object-position: center;
    padding: 0;
}

#forum-header-container{
    --group-icon-size: 100px;
    --above-margin-left: calc(var(--group-icon-size) - 10px);
    background-color: var(--primary);
    height: 100%;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 15px 5%;
    position: relative;
}

#forum-header-above {
    position: absolute;
    display: flex;
    flex-direction: row;
    top: -40%;
}

#forum-header-above-name {
    background-color: var(--primary);
    border-radius: 10px;
    padding: 5px 20px;
    display: flex;
    flex-direction: column;
    margin-left: var(--above-margin-left);
}

#group-name {
    font-size: 1.5em;
    font-weight: bolder;
}

#group-icon {
    width: var(--group-icon-size);
    height: var(--group-icon-size);
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    position: absolute;
    top: -40%;
}

#forum-header-below {
    width: 100%;
    margin-top: 10px;
    margin-left: calc(var(--group-icon-size) + 10px);
    display: flex;
    flex-direction: row;
    column-gap: 40px;
    align-items: center;
}

#group-description {
    flex: 0 0 50%;
}

#forum-header-subscribers {
    font-size: 1.2em;
    flex: 0 0 20%;
}

#forum-options {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: center;
}

#privileged-options button {
    border: none;
    outline: none;
    background: transparent;
}

#privileged-options .material-symbols-outlined {
    background: transparent;
    font-size: 2em;
    color: white;
}

#normal-options {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: center;
}

#normal-options button {
    margin: 0;
}

.subscribed {
    background-color: transparent;
    color: white;
    border-radius: 10px;
    height: 3rem;
    width: 8.5rem;
    transition: all 0.3s;
}

.subscribed:hover {
    background-color: white;
    border: white solid 3.5px;
    color: black;
    text-decoration: none;
}

#forum-header-below-tags {
    margin-left: calc(var(--group-icon-size) + 10px);
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
}
</style>