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
                        <span class="material-symbols-outlined" title="Edit this forum">Edit</span>
                    </button>

                    <button @click="deleteForum()">
                        <span class="material-symbols-outlined" title="Delete this forum">delete</span>
                    </button>
                </div>

                

                <div id="normal-options">
                    <button v-if="!forum.isCreator" :class="{ 'subscribed': workingSubscribe, 'white-btn': !workingSubscribe  }" @click="toggleSubscribe">
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
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            workingSubscribe: false,
            savedSubscribe: false,
            debouncedSubscribeUpdate: null,
            numOfSubs: 0,
            confirm: useConfirmStore().confirm,
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
        this.numOfSubs = this.forum.subscribers;

        // set debounce function to only send request to update backend if user has not toggled subscribe button for 3 seconds
        this.debouncedSubscribeUpdate = debounce(this.updateSubscribe, 3000);

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

            this.debouncedSubscribeUpdate();
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
            this.debouncedSubscribeUpdate.flush();
        },

        async deleteForum(){
            const confirmDelete = await this.confirm('Are you sure you want to delete this forum? This action is irreversible!');

            if (!confirmDelete) {
                return;
            }
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/${this.forum._id}`, {
                mode: 'cors',
                method: 'DELETE',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(async (data) => {
                    window.location.href = '/forum.html';
                });
            }).catch((error) => {
                console.log(error);
            });
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
    border: 5px solid var(--primary);
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
    flex: 0 0 15%;
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
    border: white solid 3.5px;
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