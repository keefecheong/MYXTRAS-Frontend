<!-- standardized forum header (includes banner and header with forum details and edit forum, subscribe, and create thread buttons) -->

<template>
    <img :src="forum.banner_link" alt="Banner" id="banner-picture"/>

    <div id="forum-header-container">
        <div id="forum-header-above">
            <img id="group-icon" :src="forum.forum_pic_link">
            
            <div id="forum-header-above-name">
                <span id="group-name">{{forum.forum_name}}</span>
                <span id="group-id">x/{{forum.forum_id}}</span>
            </div>
        </div>
            
        <div id="forum-header-below">
            <div id="forum-header-below-info">
                <div v-if="forum.forum_desc">
                    <span>Description: </span>
                    <span class="hide-overflow-text">{{forum.forum_desc}}</span>
                </div>

                <div id="forum-header-below-tags" v-if="forum.tags.length > 0">
                    <span>Tags: </span>
                    <InterestBadgeList :selectedOption="forum.tags" :selection="false" />
                </div>
            </div>

            <div id="forum-header-subscribers">
                <span>{{"Subscribers: " + numOfSubs}}</span>
            </div>

            <div id="forum-options">
                <div id="privileged-options" v-if="forum.isCreator">
                    <button @click="showForumForm">
                        <span class="material-symbols-outlined">Edit</span>
                    </button>
                </div>

                <div id="normal-options">
                    <button :class="{ 'subscribed': workingSubscribe, 'white-btn': !workingSubscribe  }" @click="toggleSubscribe">
                        {{ workingSubscribe ? 'Unsubscribe' : 'Subscribe' }}
                    </button>

                    <button v-if="showCreateThreadButton" @click="showCreateThread" class="white-btn">Create Thread!</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import InterestBadgeList from '../general/InterestBadgeList.vue';

export default {
    data() {
        return {
            workingSubscribe: false,
            savedSubscribe: false,
            subscribeTimeout: null,
            numOfSubs: 0
        }
    },
    props: [
        'forum',
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
    created() {
        this.workingSubscribe = this.forum.isSubscribed;
        this.savedSubscribe = this.forum.isSubscribed;
        this.numOfSubs = this.forum.subscribers.length;

        window.addEventListener('beforeunload', this.completeSubscribeRequest);
    },
    beforeUnmount() {
        this.completeSubscribeRequest();
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
        // to toggle subscribe status
        toggleSubscribe() {
            // toggle subscribe on frontend
            this.workingSubscribe = !this.workingSubscribe;

            // update subscriber count
            if (this.workingSubscribe) {
                this.numOfSubs += 1;
            }
            else {
                this.numOfSubs -= 1;
            }

            // set timeout and only send request to update backend if user has not toggled subscribe button for 3 seconds
            clearTimeout(this.subscribeTimeout);

            this.subscribeTimeout = setTimeout(this.updateSubscribe, 3000);
        },
        // to send request to subscribe/unsubscribe
        async updateSubscribe(){
            const targetURL = `${import.meta.env.VITE_APP_SERVER_URL}/api/forums/subscribe/${this.forum._id}`;
            const options = {
                mode: 'cors',
                credentials: 'include'
            }

            // only send request to subscribe if saved value is false and new value is true
            if (this.workingSubscribe && !this.savedSubscribe) {
                options.method = 'POST';

                await fetch(targetURL, options).then(res => {
                    if (res.ok) {
                        this.savedSubscribe = true;
                    }
                    else {
                        console.log('An error occurred.');
                    }
                }).catch(error => {
                    console.log('Unable to subscribe to forum.');
                });
            }
            // only send request to unsubscribe if saved value is true and new value is false
            else if (!this.workingSubscribe && this.savedSubscribe) {
                options.method = 'DELETE';

                await fetch(targetURL, options).then(res => {
                    if (res.ok) {
                        this.savedSubscribe = false;
                    }
                    else {
                        console.log('An error occurred.');
                    }
                }).catch(error => {
                    console.log('Unable to unsubscribe from forum.');
                });
            }
        },
        // handle updating of subscribe status if pending
        completeSubscribeRequest() {
            if (this.subscribeTimeout) {
                clearTimeout(this.subscribeTimeout);
                this.updateSubscribe();
            }
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
    margin-top: 20px;
    margin-left: calc(var(--group-icon-size) + 10px);
    display: flex;
    flex-direction: row;
    column-gap: 40px;
    align-items: center;
}

#forum-header-below-info {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
}

#forum-header-below-tags {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
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
</style>