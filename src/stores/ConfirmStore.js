import { defineStore } from 'pinia';

export const useConfirmStore = defineStore('confirmStore', {
    state: () => {
        return {
            showConfirm: false,
            confirmMsg: '',
            resolveConfirm: null
        }
    },
    actions: {
        // to show confirm and make tasks wait for user to use confirm
        confirm(message) {
            return new Promise((resolve) => {
                this.confirmMsg = message;
                this.showConfirm = true;

                this.resolveConfirm = resolve;
            });
        },
        // to resolve promise and close confirm
        closeConfirm(decision) {
            this.resolveConfirm(decision);
            this.showConfirm = false;
            this.confirmMsg = '';
        }
    }
})