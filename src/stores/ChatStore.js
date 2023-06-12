import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useChatStore = defineStore('chatStore', {
    state: () => {
        return {
            // use localstorage to persist chat data over refresh
            currentChat: useLocalStorage('currentChat', {})
        }
    }
});