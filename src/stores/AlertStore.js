import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alertStore', {
    state: () => {
        return {
            showAlert: false,
            alertMsg: '',
            resolveAlert: null
        }
    },
    actions: {
        // to show alert and make tasks wait for user to use alert
        alert(message) {
            return new Promise((resolve) => {
                this.alertMsg = message;
                this.showAlert = true;

                this.resolveAlert = resolve;
            });
        },
        // to resolve promise and close alert
        closeAlert() {
            this.resolveAlert();
            this.showAlert = false;
            this.alertMsg = '';
        }
    }
})