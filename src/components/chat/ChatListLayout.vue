<template>
    <div class="chatlist-item" @click="selectChat">
        <!-- other user's profile pic -->
        <div class="profile-pic-container">
            <img class="profile-pic" :src="chat.pic"/>
        </div>

        <!-- other user's username -->
        <div class="hide-overflow-text chat-name">
            <span>{{ chat.name }}</span>
        </div>
    </div>
</template>

<script>
import { useChatStore } from '../../stores/ChatStore.js';

export default {
    props: [
        'chat'
    ],
    methods: {
        // select chat to send/view messages
        selectChat() {
            const store = useChatStore();
            store.currentChat = this.chat;
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

.chatlist-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid lightgray;
    column-gap: 15px;
    align-items: center;
    user-select: none;
}

.profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 50px;
    width: 50px;
}

.chat-name {
    font-size: 1.2em;
    font-weight: 600;
}
</style>