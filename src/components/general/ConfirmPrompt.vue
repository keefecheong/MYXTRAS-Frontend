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
                <span id="confirm-header">Notice:</span>
                <span id="confirm-message"><slot></slot></span>
            </div>

            <div id="confirm-controls-container">
                <button id="confirm-true" type="button" @click="() => handleConfirm(true)">OK</button>
                <button id="confirm-false" type="button" @click="() => handleConfirm(false)">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: [
        'close-confirm'
    ],
    mounted() {
        document.getElementById('confirm-true').focus();
    },
    methods: {
        handleConfirm(decision) {
            this.$emit('close-confirm', decision);
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

#confirm-overlay {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 99;
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

#confirm-content-text {
    display: flex;
    flex-direction: column;
    align-items: start;
}

#confirm-header {
    font-size: 1.3em;
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
    border-radius: 15px;
    border: none;
    padding: 2px 8px;
    user-select: none;
}

#confirm-false {
    background-color: var(--dark);
    border: 1px solid white !important;
    color: white;
}

#confirm-controls-container button:focus, #confirm-controls-container button:hover {
    background-color: var(--primary);
    outline: none;
    color: white;
}
</style>