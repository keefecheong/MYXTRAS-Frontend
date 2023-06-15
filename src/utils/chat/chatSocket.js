// to allow all components to share a common chat socket instance

import { io } from 'socket.io-client';
import pinia from '../../stores/store.js';
import { useChatStore } from '../../stores/ChatStore.js';

// define chat socket
class ChatSocket {
    constructor() {
        // initiate socket connection with backend
        this.socket = io(`${import.meta.env.VITE_APP_SERVER_URL}/chatSocket`, {
            withCredentials: true,
            reconnection: true
        });

        const store = useChatStore(pinia);

        // handle 'receive-message' events
        // when socket receives new messages
        this.socket.on('receive-message', (data) => {
            this.updateLocalChatsMessages(store, data);
        });

        // handle 'receive-edit-message' events
        // when a message is edited
        this.socket.on('receive-edit-message', (data) => {
            // push message to editedMessages
            store.editedMessages.push(data.message);
        });

        // handle 'receive-delete-message' events
        // when a message is deleted
        this.socket.on('receive-delete-message', (data) => {
            // push message to deletedMessages
            store.deletedMessages.push(data.message);
        })
    }

    // disconnects the socket
    disconnect() {
        this.socket.disconnect();
    }

    // store new chat/message in ChatStore
    updateLocalChatsMessages(store, data) {
        // check if chat is stored in localMessages
        // if chat is not stored, add the chat to localChats
        const existingLocalChat = store.localChats.find(existingChat => existingChat._id == data.chat._id) || null;

        if (!existingLocalChat) {
            store.localChats.push(data.chat);
        }
        else {
            // if the same chat id already exists, check if the last_message_timestamps are the same
            // use the latest last_message_timestamp
            const currentTimestamp = new Date(existingLocalChat.last_message_timestamp);
            const newTimestamp = new Date(data.chat.last_message_timestamp);

            if (newTimestamp - currentTimestamp > 0) {
                existingLocalChat.last_message_timestamp = data.chat.last_message_timestamp;
            }
        }

        // check if received message is stored in localMessages
        // if message is not stored, add the message to localMessages
        if (!store.localMessages.some(addedMessage => addedMessage._id == data.message._id)) {
            data.message.chat_id = data.chat._id;
            store.localMessages.push(data.message);
        }
    }
}

// export socket instance so every component calling this file shares the same chat socket
export const socket = new ChatSocket().socket;

// https://stackoverflow.com/a/74770786