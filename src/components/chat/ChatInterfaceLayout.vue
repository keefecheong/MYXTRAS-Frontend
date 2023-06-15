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

                <!-- only show if currentStatus is not null (default) -->
                <div id="chat-user-status" v-if="currentStatus">
                    <span>{{ currentStatus }}</span>
                </div>
            </div>
        </div>

        <!-- container for messages in the chat -->
        <div id="chat-interface-messages-container">
            <div id="loading-previous" v-if="loadingPrevious">
                <span>Loading...</span>
            </div>
            
            <div id="chat-interface-messages" :class="{loading: loadingPrevious}">
                <button id="load-previous-messages" @click="loadPreviousMessages" :disabled="loadingPrevious">Load Previous</button>

                <ChatMessageLayout 
                    v-for="(message, index) in copyMessages" 
                    :message="message" 
                    :previous_creation_time="previous_creation_time(index)" 
                    :previous_is_sender="previous_is_sender(index)"
                    :index="index"
                    @edit-message="editMessage"
                    @delete-message="deleteMessage"
                />
            </div>
        </div>

        <!-- container for message input -->
        <div id="chat-interface-input">
            <form @submit.prevent="sendMessage">
                <input id="chat-message-input" type="text" placeholder="Message..." title="Enter your message" v-model="messageText" @input="updateTypingStatus" />

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
            previousMessageLength: 0,
            currentStatus: null,
            loadingPrevious: false,
            copyMessages: [],
            preventScroll: false
        }
    },
    props: [
        'chat',
        'messages'
    ],
    emits: [
        'update-chat-timestamp'
    ],
    components: {
        ChatMessageLayout
    },
    created() {
        // copy messages into copyMessages for manipulation
        this.copyMessages = JSON.parse(JSON.stringify(this.messages));

        // initialize user status and user status listeners
        this.getUserStatus();
    },
    mounted() {
        // scroll to bottom of messages when mounted
        this.checkChangeMessages();
    },
    updated() {
        // sroll to bottom of messages when new messages are added
        this.checkChangeMessages();
    },
    unmounted() {
        // clean up socket listeners
        socket.off('update-user-presence', this.updateUserPresence);
        socket.off('receive-user-typing', this.updateUserTyping);
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
                _id: new ObjectID().toString(),
                content: this.messageText,
                is_sender: true,
                creation_time: new Date().toISOString()
            }

            socket.emit('send-message', {
                message: newMessage,
                chat: this.chat
            });

            // add message to localMessages
            newMessage.chat_id = this.chat._id;
            this.store.localMessages.push(newMessage);

            // update last_message_timestamp
            this.$emit('update-chat-timestamp', {
                chatId: this.chat._id,
                last_message_timestamp: newMessage.creation_time
            });

            this.messageText = '';

            // give focus to input field
            document.getElementById('chat-message-input').focus();
        },
        // to edit message and update backend
        editMessage(data) {
            socket.emit('edit-message', {
                message: {
                    _id: data.messageId,
                    content: data.editedMessage,
                    chat_id: this.chat._id
                },
                targetUserId: this.chat.targetUserId
            });

            // update edited message's content
            this.copyMessages.find(existingMessage => existingMessage._id == data.messageId).content = data.editedMessage;
        },
        // to delete message and update backend
        deleteMessage(data) {
            socket.emit('delete-message', {
                message: {
                    _id: data.messageId,
                    chat_id: this.chat._id
                },
                targetUserId: this.chat.targetUserId
            });

            // remove deleted message from existing messages
            const existingIndex = this.copyMessages.findIndex(existingMessage => existingMessage._id == data.messageId);
            this.copyMessages.splice(existingIndex, 1);
        },
        // to update user's typing status
        // status changes to typing whenever user presses a key
        // status changes back to after 1s from the last keypress
        updateTypingStatus() {
            // only update typing status if other user is online
            // if currentStatus is offline or null then do nothing
            if ((this.currentStatus == this.status.offline) || (!this.currentStatus)) {
                return;
            }

            // tell other user that current user is typing
            this.sendTypingStatus(true);

            clearTimeout(this.typingTimer);

            // tell other user that current user is not typing after 1s from the last input
            this.typingTimer = setTimeout(() => {
                this.sendTypingStatus(false)
            }, 1000);
        },
        // update the other user that current user is typing/not typing
        sendTypingStatus(typing) {
            socket.emit('user-typing', {
                typing: typing,
                targetUserId: this.chat.targetUserId
            });
        },
        // get/react to other user's status and set up socket listeners (online/offline/typing)
        getUserStatus() {
            // to query initial user presence
            this.getUserPresence();

            // set listener for update of user's status
            socket.on('update-user-presence', this.updateUserPresence);

            // set listener for update of user's typing status
            socket.on('receive-user-typing', this.updateUserTyping);
        },
        // query server whether user is online or not
        getUserPresence() {
            socket.emit('query-user-presence', {
                targetUserId: this.chat.targetUserId
            }, (res) => {
                // update user status based on server response
                this.updateOnlineStatus(res.online);
            });
        },
        // set currentStatus based on online parameter value
        updateOnlineStatus(online) {
            if (online) {
                this.currentStatus = this.status.online;
            }
            else {
                this.currentStatus = this.status.offline;
            }
        },
        // callback for 'update-user-presence' event
        updateUserPresence(data) {
            // if event is for the current target user then update presence status
            if (data.userId == this.chat.targetUserId) {
                this.updateOnlineStatus(data.online);
            }
        },
        // callback for 'receive-user-typing' event
        updateUserTyping(data) {
            if (data.userId == this.chat.targetUserId) {
                // if event is for the current target user
                // if user is typing then set status to typing
                if (data.typing) {
                    this.currentStatus = this.status.typing;
                }
                // otherwise query presence and set to user presence
                else {
                    this.getUserPresence();
                }
            }
        },
        // check for change in messages and scroll to bottom
        checkChangeMessages() {
            const messageLength = this.copyMessages.length;

            // only scroll to bottom if preventScroll is false
            if (!this.preventScroll) {
                if (messageLength != this.previousMessageLength) {
                    this.scrollMessagesBottom();
                }
            }

            // reset preventScroll to false to scroll on next update
            this.preventScroll = false;

            this.previousMessageLength = messageLength;
        },
        // scroll to bottom of chat messages
        scrollMessagesBottom() {
            const messageContainer = document.getElementById('chat-interface-messages-container');
            messageContainer.scrollBy(0, messageContainer.scrollHeight);
        },
        // load more messages stored in database
        async loadPreviousMessages() {
            this.loadingPrevious = true;
            const encodedTimestamp = encodeURIComponent(this.copyMessages[0].creation_time);

            // send request to backend to get previous messages
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chats/${this.chat._id}/${encodedTimestamp}/100`, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (data.messages) {
                        if (data.messages.length > 0) {
                            // set preventScroll to true to prevent user from having to scroll from bottom to view previous messages
                            this.preventScroll = true;

                            // if there are more history messages
                            // update message list with previous messages
                            this.copyMessages = data.messages.concat(this.copyMessages);
                        }
                        else {
                            // if there are no more history messages then tell user no more messages found
                            // TODO: update UI (set up dialog box component and display messages)
                            alert('No more messages found.');
                        }
                    }
                    else {
                        console.log('Could not retrieve messages.');
                    }
                });
            }).catch((error) => {
                console.log(error);
            });

            this.loadingPrevious = false;
        },
        // get creation_time of previous message or '' if it is the first message
        previous_creation_time(index) {
            return index == 0 ? '' : this.copyMessages[index - 1].creation_time;
        },
        // get is_sender of previous message or null if it is the first message
        previous_is_sender(index) {
            return index == 0 ? null : this.copyMessages[index - 1].is_sender;
        }
    },
    watch: {
        // watch chat value
        'chat': {
            handler() {
                // get user presence when chat changes
                this.getUserPresence();
            }
        },
        // watch messages value
        'messages': {
            handler() {
                // update copyMessages with new set of messages when messages changes
                this.copyMessages = JSON.parse(JSON.stringify(this.messages));
            }
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
#chat-interface-messages-container {
    flex: 1;
    overflow-y: auto;
    position: relative;
}

#chat-interface-messages {
    padding: 15px;
}

#chat-interface-messages.loading {
    opacity: 0.7;
}

#loading-previous {
    position: absolute;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    height: 100%;
    width: 100%;
}

#loading-previous span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#load-previous-messages {
    border-radius: 20px;
    padding: 10px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 20px;
}

#load-previous-messages:hover {
    opacity: 0.7;
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