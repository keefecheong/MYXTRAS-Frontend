import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        // use sessionStorage to persist currentChat for each tab over refresh (can be different on each open tab)
        // currentChat stores the chat that user is currently interacting with
        currentChat: useSessionStorage('currentChat', {}),
        
        // localChats stores the newly created chats that have no messages sent yet
        localChats: [],

        // localMessages stores the sent/received messages through sockets
        localMessages: [],

        // editedMessages store the _id and content of edited messages
        editedMessages: [],

        // deletedMessages store the _id of deleted messages
        deletedMessages: []
    })
});