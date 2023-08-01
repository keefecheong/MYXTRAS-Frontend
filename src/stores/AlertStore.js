import { useSessionStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { createResolveId, resolve } from '../utils/alert/resolveHandler.js'

export const useAlertStore = defineStore('alertStore', {
    state: () => {
        return {
            showAlert: useSessionStorage('showAlert', false),
            alertMsg: useSessionStorage('alertMsg', ''),
            resolveAlertId: useSessionStorage('resolveAlertId', null)
        }
    },
    actions: {
        // to show alert and make tasks wait for user to use alert
        alert(message) {
            return new Promise((resolve) => {
                this.alertMsg = message;
                this.showAlert = true;

                this.resolveAlertId = createResolveId(resolve);
            });
        },
        // to resolve promise and close alert
        closeAlert() {
            this.resolveAlertId = resolve(this.resolveAlertId);
            
            this.showAlert = false;
            this.alertMsg = '';
        }
    }
})