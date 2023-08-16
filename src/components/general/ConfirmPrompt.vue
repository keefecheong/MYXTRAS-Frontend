<!--
    custom confirm prompt to replace confirm()

    usage:
        events:
            close-confirm: emitted when user clicks 'OK' or 'Cancel', decision: true ('OK') or false ('Cancel')
        slots:
            pass in message to display

    example:
        (put in root at parent components (eg. feed.vue) that have child components using confirm)
        === parent ===
        <template>
            <ConfirmPrompt v-if="showConfirm && confirmMsg.length > 0" @close-confirm="closeConfirm">
                {{ confirmMsg }}
            </ConfirmPrompt>

            <div>
                ...
            </div>
        </template>

        <script>
        import { useConfirmStore } from '../../stores/ConfirmStore.js';

        export default {
            data() {
                return {
                    confirmStore: useConfirmStore()
                }
            },
            methods: {
                // to close confirm prompt
                closeConfirm(decision) {
                    this.confirmStore.closeConfirm(decision);
                }
            },
            computed: {
                showConfirm() {
                    return this.confirmStore.showConfirm;
                },
                confirmMsg() {
                    return this.confirmStore.confirmMsg;
                }
            }
        }

        === children ===
        <template>
            <button @click="confirm">Confirm</button>
        </template>

        <script>
            import { useConfirmStore } from '../path/ConfirmStore.js';

            export default {
                data() {
                    return {
                        // if there is multiple usage
                        confirm: useConfirmStore().confirm
                    }
                },
                methods: {
                    // to show confirm prompt
                    confirm() {
                        const decision = await this.confirm('message');

                        // if single use in component can use
                        const decision = await useConfirmStore().confirm('message');

                        // decision is true/false based on user action
                        if (decision) {
                            ...
                        }
                    }
                }
            }
        </script>
-->

<template>
    <div id="confirm-overlay">
        <div id="confirm-content">
            <div id="confirm-content-text">
                <h3 id="confirm-header">Notice:</h3>
                <h5 id="confirm-message"><slot></slot></h5>
            </div>

            <div id="confirm-controls-container">
                <button
                    id="confirm-true"
                    type="button"
                    @click="() => handleConfirm(true)"
                >
                    OK
                </button>
                <button
                    id="confirm-false"
                    type="button"
                    @click="() => handleConfirm(false)"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["close-confirm"],
    mounted() {
        document.getElementById("confirm-true").focus();
    },
    methods: {
        handleConfirm(decision) {
            this.$emit("close-confirm", decision);
        },
    },
};
</script>

<style>
#confirm-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: var(--prompt-z-index);
    background-color: rgba(0, 0, 0, 0.5);
}

#confirm-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 20%;
    max-height: 40%;
    min-width: 20%;
    max-width: 30%;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
    row-gap: 50px;
    color: black;
}

#confirm-content-text {
    display: flex;
    flex-direction: column;
    align-items: start;
}

#confirm-header {
    font-size: 1.3em;
    font-weight: bold;
}

#confirm-message {
    margin: 0 auto;
    font-style: italic;
}

#confirm-controls-container {
    display: flex;
    justify-content: end;
    column-gap: 20px;
}

#confirm-controls-container button {
    width: fit-content;
    border-radius: 5px;
    border: none;
    padding: 1vh 1vw;
    user-select: none;
    color: white;
}

#confirm-false {
    background-color: var(--red);
    border: 2px solid var(--red) !important;
    color: white;
}
#confirm-true {
    background-color: var(--green);
    border: 2px solid var(--green) !important;
    color: white;
}

#confirm-controls-container button:hover {
    background-color: white;
    outline: none;
    color: black;
    font-weight: bold;
}
</style>
