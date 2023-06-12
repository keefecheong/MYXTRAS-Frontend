<template>
    <div id="chat-interface-layout-container">
        <!-- chat interface header, contains the other user's profile picture, username, and status -->
        <div id="chat-interface-header">
            <!-- other user's profile pic -->
            <div class="profile-pic-container">
                <img class="profile-pic" :src="chat.pic"/>
            </div>

            <!-- other user's username and status -->
            <div id="chat-interface-user-info-container">
                <div id="chat-name" class="hide-overflow-text">
                    <span>{{ chat.name }}</span>
                </div>

                <div id="chat-user-status">
                    <span>{{ status.online }}</span>
                </div>
            </div>
        </div>

        <!-- container for messages in the chat -->
        <div id="chat-interface-messages">
            <ChatMessageLayout 
                v-for="(message, index) in messages" 
                :message="message" 
                :previous_creation_time="index == 0 ? '' : messages[index - 1].creation_time" 
                :previous_is_sender="index == 0 ? '' : messages[index - 1].is_sender"
            />
        </div>

        <!-- container for message input -->
        <div id="chat-interface-input">
            <form @submit.prevent="">
                <input id="chat-message-input" type="text" placeholder="Message..." title="Enter your message" />

                <button title="Send message">
                    <span class="material-symbols-outlined" id="chat-message-send">Send</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import ChatMessageLayout from './ChatMessageLayout.vue';
import { useChatStore } from '../../stores/ChatStore';

export default {
    data() {
        return {
            chat: null,
            store: useChatStore(),
            status: {
                online: 'Online',
                offline: 'Offline',
                typing: 'Typing...'
            },
            messages: [
                {
                    id: '1',
                    content: 'first message first message first message first message first message first message first message first message first message first message first message ',
                    is_sender: true,
                    creation_time: '2023-06-11T09:38:52.705+00:00'
                },
                {
                    id: '2',
                    content: 'second message',
                    is_sender: true,
                    creation_time: '2023-06-11T09:38:58.705+00:00'
                },
                {
                    id: '3',
                    content: 'third message',
                    is_sender: false,
                    creation_time: '2023-06-11T09:40:52.705+00:00'
                },
                {
                    id: '4',
                    content: 'fourth message',
                    is_sender: true,
                    creation_time: '2023-06-11T09:42:52.705+00:00'
                },
                {
                    id: '5',
                    content: 'first message first message first message first message first message first message first message first message first message first message first message ',
                    is_sender: true,
                    creation_time: '2023-06-11T09:44:52.705+00:00'
                },
                {
                    id: '6',
                    content: 'first message first message first message first message first message first message first message first message first message first message first message ',
                    is_sender: false,
                    creation_time: '2023-06-11T09:46:58.705+00:00'
                },
            ]
        }
    },
    components: {
        ChatMessageLayout
    },
    created() {

    },
    watch: {
        // watch for changes of currentChat in ChatStore
        'store.currentChat': {
            handler(newValue, oldValue) {
                if ((JSON.stringify(newValue) != JSON.stringify(oldValue)) || this.chat == null) {
                    this.chat = newValue;
                }
            },
            immediate: true
        }
    },
    methods: {

    }
}
</script>

<style>
@import url('../../styles/main.css');

/* container styles */
#chat-interface-layout-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* chat interface header styles */
#chat-interface-header {
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid black;
    column-gap: 15px;
    width: 100%;
    user-select: none;
}

.profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 50px;
    width: 50px;
}

#chat-interface-user-info-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
}

#chat-name {
    font-size: 1.2em;
    font-weight: 600;
}

#chat-user-status {
    font-size: 0.8em;
}

/* message container styles */
#chat-interface-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
}

/* input styles */
#chat-interface-input {
    border-top: 1px solid lightgray;
    padding: 15px;
}

#chat-interface-input form {
    display: flex;
    column-gap: 5px;
}

#chat-message-input {
    padding: 10px;
    outline: none;
    border: 1px solid black;
    border-radius: 20px;
    width: 100%;
}

#chat-interface-input button {
    border: none;
    background-color: transparent;
}

#chat-message-send {
    color: black;
    font-size: 2em;
}
</style>