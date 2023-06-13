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

        // handle 'update-sent-message' events
        // when socket receives messages sent by self from another associated socket
        this.socket.on('update-sent-message', (data) => {
            this.updateChatStore(store, data);
        });

        // handle 'recipient-receive-message' events
        // when socket receives messages sent by other users
        this.socket.on('recipient-receive-message', (data) => {
            this.updateChatStore(store, data);
        });
    }

    // disconnects the socket
    disconnect() {
        this.socket.disconnect();
    }

    // store new chat/message in ChatStore
    updateChatStore(store, data) {
        // check if chat is stored in localMessages
        const chatExists = store.localChats.find(addedChat => {
            addedChat.id == data.chat.id;
        }) || null;

        // if chat is not stored, add the chat to localChats
        if (!chatExists) {
            store.localChats.push(data.chat);
        }

        // check if received message is stored in localMessages
        const messageExists = store.localMessages.find(addedMessage => {
            addedMessage.id == data.message.id;
        }) || null;

        // if message is not stored, add the message to localMessages
        if (!messageExists) {
            const message = data.message;
            message.chatId = data.chat.id;
            store.localMessages.push(message);
        }
    }
}

// export socket instance so every component calling this file shares the same chat socket
export const socket = new ChatSocket().socket;

// https://stackoverflow.com/a/74770786