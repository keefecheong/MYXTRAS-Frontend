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
            <form @submit.prevent="sendMessage" @keydown="updateTypingStatus">
                <input id="chat-message-input" type="text" placeholder="Message..." title="Enter your message" v-model="messageText" />

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
import { socket } from '../../utils/chat/chatSocket.js';
import ObjectID from 'bson-objectid';

export default {
    data() {
        return {
            store: useChatStore(),
            status: {
                online: 'Online',
                offline: 'Offline',
                typing: 'Typing...'
            },
            typingTimer: null,
            messageText: '',
            previousMessageLength: 0
        }
    },
    props: [
        'chat',
        'messages'
    ],
    components: {
        ChatMessageLayout
    },
    mounted() {
        this.checkNewMessages();
    },
    updated() {
        this.checkNewMessages();
    },
    methods: {
        // to send message to backend
        sendMessage() {
            // if no message is entered then do nothing
            if (this.messageText.trim().length <= 0) {
                return;
            }

            // otherwise send the message to the backend
            const newMessage = {
                id: new ObjectID().toString(),
                content: this.messageText,
                is_sender: true,
                creation_time: new Date().toISOString()
            }

            socket.emit('send-message', {
                message: newMessage,
                chat: this.chat
            });

            // add message to localMessages
            newMessage.chatId = this.chat.id;
            this.store.localMessages.push(newMessage);

            this.messageText = '';

            // give focus to input field
            document.getElementById('chat-message-input').focus();
        },
        // to update user's typing status
        // status changes to typing whenever user presses a key
        // status changes back to after 1s from the last keypress
        updateTypingStatus() {
            // tell other user that current user is typing
            this.sendTypingStatus();

            clearTimeout(this.typingTimer);

            // tell other user that current user is not typing after 1s from the last input
            this.typingTimer = setTimeout(this.sendNonTypingStatus, 1000);
        },
        // update the other user that current user is typing
        sendTypingStatus() {
            // emit socket event
        },
        // update the other user that current user is no longer typing
        sendNonTypingStatus() {
            // emit socket event
        },
        // get other user's status (online/offline/typing)
        getUserStatus() {
            // handle socket event
        },
        // check for new messages and scroll to bottom
        checkNewMessages() {
            const messageLength = this.messages.length;

            if (messageLength > this.previousMessageLength) {
                this.scrollMessagesBottom();
            }

            this.previousMessageLength = messageLength;
        },
        // scroll to bottom of chat messages
        scrollMessagesBottom() {
            const messageContainer = document.getElementById('chat-interface-messages');
            messageContainer.scrollBy(0, messageContainer.scrollHeight);
        }
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

#chat-interface-input button:focus {
    border-radius: 20px;
    outline: 1px solid black;
}

#chat-message-send {
    color: black;
    font-size: 2em;
}
</style>