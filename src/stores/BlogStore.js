import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useBlogStore = defineStore('blogStore', {
    state: () => {
        return {
            // use sessionStorage to persist blog data over refresh and for each tab
            blogToEdit: useSessionStorage('blogToEdit', {})
        }
    }
})