import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        // use localstorage to persist chat data over refresh
        // currentChat stores the chat that user is currently interacting with
        currentChat: useLocalStorage('currentChat', {}),

        // localChats stores the newly created chats that have no messages sent yet
        // to be merged with chats retrieved from database for display
        localChats: useLocalStorage('localChats', []),

        // localMessages stores the sent/received messages through sockets
        // to be merged with messages retrieved from database for display
        localMessages: useLocalStorage('localMessages', [])
    }),
    actions: {
        // reset values
        reset() {
            // reset currentChat
            this.currentChat = {};

            // retain localChats and localMessages to store locally
            // only empty on next session (retrieved from database then)
        }
    }
});