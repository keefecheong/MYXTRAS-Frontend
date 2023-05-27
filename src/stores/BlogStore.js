import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useBlogStore = defineStore('blogStore', {
    state: () => {
        return {
            // use localstorage to persist  blog data over refresh
            blogToEdit: useLocalStorage('blogToEdit', {})
        }
    }
})