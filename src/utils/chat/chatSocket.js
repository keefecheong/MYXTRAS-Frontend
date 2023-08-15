// to allow all components to share a common chat socket instance

import { io } from "socket.io-client";
import pinia from "../../stores/Store.js";
import { useChatStore } from "../../stores/ChatStore.js";

// define chat socket
class ChatSocket {
    constructor() {
        // initiate socket connection with backend
        this.socket = io(`${process.env.APP_SERVER_URL}/chatSocket`, {
            withCredentials: true,
            reconnection: true,
        });

        const store = useChatStore(pinia);

        // handle 'receive-message' events
        // when socket receives new messages
        this.socket.on("receive-message", (data) => {
            // add chat and message
            store.newChat(data.chat);

            data.message.chat_id = data.chat._id;
            store.newMessage(data.message);
        });

        // handle 'receive-edit-message' events
        // when a message is edited
        this.socket.on("receive-edit-message", (data) => {
            store.editMessage(
                data.message.chat_id,
                data.message._id,
                data.message.content,
                data.message.last_modified_time,
            );
        });

        // handle 'receive-delete-message' events
        // when a message is deleted
        this.socket.on("receive-delete-message", (data) => {
            store.deleteMessage(data.message.chat_id, data.message._id);
        });
    }

    // disconnects the socket
    disconnect() {
        this.socket.disconnect();
    }
}

// export socket instance so every component calling this file shares the same chat socket
export const socket = new ChatSocket().socket;

// https://stackoverflow.com/a/74770786
