<template>
    <div
        class="chatlist-item"
        :class="{ selectedChat: selected }"
        @click="selectChat"
    >
        <!-- other user's profile pic -->
        <div class="profile-pic-container">
            <img class="profile-pic" :src="chat.pic" />
        </div>

        <!-- other user's username -->
        <div class="hide-overflow-text chat-name">
            <span>{{ chat.name }}</span>
        </div>
    </div>
</template>

<script>
import { useChatStore } from "../../stores/ChatStore.js";

export default {
    data() {
        return {
            store: useChatStore(),
        };
    },
    props: ["chat", "selected"],
    methods: {
        // select chat to send/view messages
        selectChat() {
            this.store.currentChat = this.chat;
        },
    },
};
</script>

<style>
.chatlist-item {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid gray;
    column-gap: 15px;
    align-items: center;
    user-select: none;
    cursor: pointer;
}

.chatlist-item:hover {
    background-color: rgba(211, 211, 211, 0.6);
}

.chatlist-item.selectedChat {
    background-color: rgba(211, 211, 211, 0.6);
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
