<!-- 
    custom alert prompt to replace alert()

    usage:
        events:
            close-alert: emitted when user clicks 'OK'
        slots:
            pass in message to display
        
    example:
        (put in root at parent components (eg. feed.vue) that have child components using alerts)
        === parent ===
        <template>
            <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
                {{ alertMsg }}
            </AlertPrompt>

            <div>
                ...
            </div>
        </template>
        
        <script>
        import { useAlertStore } from '../../stores/AlertStore.js';

        export default {
            data() {
                return {
                    alertStore: useAlertStore()
                }
            },
            methods: {
                // to close alert prompt
                closeAlert() {
                    this.alertStore.closeAlert();
                }
            },
            computed: {
                showAlert() {
                    return this.alertStore.showAlert;
                },
                alertMsg() {
                    return this.alertStore.alertMsg;
                }
            }
        }

        === children ===
        <template>
            <button @click="alert">Alert</button>
        </template>

        <script>
            import { useAlertStore } from '../path/AlertStore.js';

            export default {
                data() {
                    return {
                        // if there is multiple usage
                        alert: useAlertStore().alert
                    }
                },
                methods: {
                    // to show alert prompt
                    alert() {
                        await this.alert('message');

                        // if single use in component can use
                        await useAlertStore().alert('message');
                    }
                }
            }
        </script>
 -->

<template>
    <div id="alert-overlay">
        <div id="alert-content">
            <div id="alert-content-text">
                <span id="alert-header">Notice:</span>
                <span id="alert-message"><slot></slot></span>
            </div>
            <button id="alert-close" type="button" @click="handleConfirm">OK</button>
        </div>
    </div>
</template>

<script>
export default {
    emits: [
        'close-alert'
    ],
    mounted() {
        // auto focus on the 'OK' button
        document.getElementById('alert-close').focus();
    },
    methods: {
        // close alert prompt
        handleConfirm() {
            this.$emit('close-alert');
        }
    }
}
</script>

<style>
#alert-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: var(--prompt-z-index);
    background-color: rgba(0, 0, 0, 0.5);
}

#alert-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 20%;
    max-height: 40%;
    min-width: 20%;
    max-height: 40%;
    background-color: var(--dark);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
    row-gap: 50px;
    color: white;
}

#alert-content-text {
    display: flex;
    flex-direction: column;
    align-items: start;
}

#alert-header {
    font-size: 1.3em;
}

#alert-message {
    margin: 0 auto;
    font-style: italic;
}

#alert-close {
    position: relative;
    left: 100%;
    transform: translateX(-100%);
    width: fit-content;
    border-radius: 15px;
    border: none;
    padding: 2px 8px;
    user-select: none;
}

#alert-close:focus, #alert-close:hover {
    background-color: var(--primary);
    outline: none;
    color: white;
}
</style>