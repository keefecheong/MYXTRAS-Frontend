import { defineStore } from 'pinia';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        // use sessionStorage to persist currentChat for each tab over refresh (can be different on each open tab)
        // currentChat stores the chat that user is currently interacting with
        currentChat: useSessionStorage('currentChat', {}),
        
        // use localStorage to persist chat and message data over refresh and over multiple tabs
        // localChats stores the newly created chats that have no messages sent yet
        // to be merged with chats retrieved from database for display
        localChats: useLocalStorage('localChats', []),

        // localMessages stores the sent/received messages through sockets
        // to be merged with messages retrieved from database for display
        localMessages: useLocalStorage('localMessages', [])
    })
});