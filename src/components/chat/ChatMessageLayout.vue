<template>
    <!-- show date above first message for each new day -->
    <div class="new-message-date" v-if="isNewDate">
        <span>{{ newDate }}</span>
    </div>

    <div class="message-container">
        <!-- display message -->
        <!--
            classes:
            sent - for messages sent by the current user
            received - for messages received (sent by other users)
            arrow-left - show arrow for every first received message
            arrow-right - show arrow for every first sent message
        -->
        <div 
            class="message" 
            :class="{
                'sent': message.is_sender,
                'received': !message.is_sender,
                'arrow-left': (isFirstMessage || isNewDate) && !message.is_sender,
                'arrow-right': (isFirstMessage || isNewDate) && message.is_sender
            }"
            @mouseenter="showMore"
            @mouseleave="hideMore"
            :id="index"
        >
            <!-- layout for normal message -->
            <div v-if="!editMode">
                <div class="message-content">
                    <!-- displayed if message has file -->
                    <div v-if="hasFile">
                        <ChatFileLayout 
                            :fileLink="message.file_link" 
                            :originalName="message.original_name"
                            :fileType="message.file_type"
                        />
                    </div>

                    <!-- displayed if message has text content -->
                    <div v-if="hasText">
                        <span>{{ message.content }}</span>
                    </div>

                    <!-- displays creation time and 'Edited' if edited (hover over 'Edited' to see last modified time) -->
                    <div class="message-timestamp-container">
                        <span class="message-timestamp last-modified-timestamp" v-if="isEdited" :title="'Last modified at ' + lastModifiedTimestamp">Edited</span>
                        <span class="message-timestamp">{{ timestamp }}</span>
                    </div>
                </div>
    
                <!-- action buttons/icons for editing/deleting message (only for senders) -->
                <div class="message-actions-container" v-if="displayMore && message.is_sender">
                    <span class="material-symbols-outlined" @click="toggleMessageActions" title="More actions">more_vert</span>
    
                    <div class="message-actions" v-if="displayMore && displayActions && message.is_sender">
                        <div @click.stop="enterEdit" title="Edit">
                            <span class="material-symbols-outlined">edit</span>
                            <span>Edit</span>
                        </div>
    
                        <div @click="deleteMessage" title="Delete">
                            <span class="material-symbols-outlined">delete</span>
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- layout for editing message (only for senders) -->
            <div class="edit-message" v-if="editMode && message.is_sender">
                <form :id="'form-' + index">
                    <DynamicTextarea 
                        title="Enter your message"
                        :maxRows="5"
                        :placeholder="'New message...'"
                        v-model="editedMessage"
                        :id="'edit-' + index"
                    ></DynamicTextarea>

                    <div>
                        <button class="cancel" @click="exitEdit" title="Discard changes">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                        <button class="submit" @click.prevent="editMessage" title="Save changes">
                            <span class="material-symbols-outlined">check</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import ChatFileLayout from './ChatFileLayout.vue';
import DynamicTextarea from '../general/DynamicTextarea.vue';

export default {
    data() {
        return {
            displayMore: false,
            displayActions: false,
            editMode: false,
            editedMessage: ''
        }
    },
    props: [
        'message',
        'previous_is_sender',
        'previous_creation_time',
        'index'
    ],
    components: {
        ChatFileLayout,
        DynamicTextarea
    },
    emits: [
        'edit-message',
        'delete-message'
    ],
    updated() {
        this.onEdit();
    },
    methods: {
        // to show more actions menu
        showMore() {
            // only change displayMore to true if not in edit mode and message is sent by the user
            if (!this.editMode && this.message.is_sender) {
                this.displayMore = true;                
            }
        },
        // to hide more actions menu
        hideMore(e) {
            // check if the cursor is within the message div
            // only hide more actions menu if the cursor is outside the message div
            if (!document.getElementById(this.index).contains(e.relatedTarget)) {
                this.displayMore = false;

                // also change displayActions back to default
                this.displayActions = false;
            }
        },
        // to toggle actions menu
        toggleMessageActions() {
            this.displayActions = !this.displayActions;
        },
        // to show edit message interface
        enterEdit() {
            // set editedMessage to message content
            this.editedMessage = this.message.content;
            this.editMode = true;

            // reset displayMore and displayActions to display as usual after finishing the edit
            this.displayMore = false;
            this.displayActions = false;
        },
        // to hide edit message interface
        exitEdit() {
            // remove event listener on window
            window.removeEventListener('click', this.offEdit);
            window.removeEventListener('focusin', this.offEdit);
            
            this.editMode = false;
        },
        // to handle edit message
        editMessage() {
            // only process the edited message if it is not equal to the original message or is not empty
            if (this.editedMessage != this.message.content && this.editedMessage.trim().length > 0) {
                this.$emit('edit-message', {
                    messageId: this.message._id,
                    editedMessage: this.editedMessage,
                    lastModifiedTime: new Date().toISOString()
                });
            }
            
            this.exitEdit();
        },
        // perform changes to the DOM after editMode is true
        onEdit() {
            if (this.editMode) {
                // set focus on edit input box
                document.getElementById(`edit-${this.index}`).focus();
    
                // set listener on window to exit edit mode if any other part of the window is given focus or clicked
                window.addEventListener('click', this.offEdit);
                window.addEventListener('focusin', this.offEdit);
            }
        },
        // callback for window click listener
        offEdit(e) {
            if (this.editMode) {
                // exit edit mode if user focuses on any element or click outside the form
                if (!document.getElementById(`form-${this.index}`).contains(e.target)) {
                    this.exitEdit();
                }
            }
        },
        // to handle delete message
        deleteMessage() {
            const data = {
                messageId: this.message._id
            }

            if (this.hasFile) {
                data.fileLink = this.message.file_link;
            }
            
            this.$emit('delete-message', data);
        }
    },
    computed: {
        // check if the creation date of the current message is different from the previous message
        isNewDate() {
            const currentDate = this.message.creation_time.split('T')[0];
            const previousDate = this.previous_creation_time.split('T')[0];

            if (currentDate != previousDate) {
                return true;
            }

            return false;
        },
        // return formatted new date to display
        newDate() {
            const date = new Date(this.message.creation_time);
            
            // formatted date: 'MMMM D, YYYY' eg. January 1, 2023
            return date.toLocaleDateString([], {
                dateStyle: 'long'
            });
        },
        // check if the message is the first message
        // (mainly for a sequence of multiple sent/received messages)
        isFirstMessage() {
            return this.message.is_sender != this.previous_is_sender;
        },
        // format creation_time for display
        timestamp() {
            const date = new Date(this.message.creation_time);

            // formatted timestamp: 'h:mmA' eg. 9:10AM
            return date.toLocaleTimeString([], {
                timeStyle: 'short'
            });
        },
        // check if message is edited based on last_modified_time
        isEdited() {
            return this.message.last_modified_time || null;
        },
        // format last_modified_time for display
        lastModifiedTimestamp() {
            const creationDate = new Date(this.message.creation_time).toLocaleDateString([], {
                dateStyle: 'short'
            });
            
            const lastModifiedTime = new Date(this.message.last_modified_time);

            const lastModifiedDate = lastModifiedTime.toLocaleDateString([], {
                dateStyle: 'short'
            });

            return creationDate == lastModifiedDate ? lastModifiedTime.toLocaleTimeString([], { timeStyle: 'short' }) : lastModifiedTime.toString();
        },
        // check if message has text content
        hasText() {
            return this.message.content != '';
        },
        // check if message has file
        hasFile() {
            return this.message.file_link || null;
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

/* date styles */
.new-message-date {
    font-weight: 600;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
    text-decoration: underline;
}

/* message styles */
.message-container {
    display: grid;
    width: 100%;
}

.message {
    width: fit-content;
    max-width: 85%;
    height: fit-content;
    padding: 8px;
    border-radius: 10px;
    margin-top: 5px;
    position: relative;
    display: grid;
    position: relative;
}

.message.received {
    justify-self: start;
    margin-left: 20px;
    background-color: black;
}

.message.sent {
    justify-self: end;
    margin-right: 20px;
    background-color: var(--dark);
}

.message.arrow-left, .message.arrow-right {
    margin-top: 20px;
}

.message.arrow-left:before {
    content: '';
    position: absolute;
    left: -10px;
    top: 5px;
    border-top: 5px solid transparent;
    border-right: 15px solid black;
    border-left: none;
    border-bottom: 5px solid transparent;
}

.message.arrow-right:before {
    content: '';
    position: absolute;
    right: -10px;
    top: 5px;
    border-top: 5px solid transparent;
    border-right: none;
    border-left: 15px solid var(--dark);
    border-bottom: 5px solid transparent;
}

/* arrow symbols from: https://codeconvey.com/css-message-box-with-arrow/ */

.message-content {
    display: flex;
    flex-direction: column;
    color: white;
}

.message-timestamp-container {
    display: flex;
    flex-direction: row;
    column-gap: 5px;
    align-items: center;
    justify-content: end;
}

.message-timestamp {
    font-size: 0.8em;
}

.last-modified-timestamp {
    font-style: italic;
}

/* message actions styles */
.message-actions-container {
    position: absolute;
    top: 5px;
    right: 5px;
    color: black;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    user-select: none;
}

.message-actions-container .material-symbols-outlined {
    color: black;
}

.message-actions {
    position: absolute;
    border: 1px solid black;
    border-radius: 10px;
    background-color: white;
    z-index: 2;
    bottom: 1.5em;
}

.message.sent .message-actions-container .message-actions {
    right: -1px;
}

.message-actions div {
    display: flex;
    column-gap: 5px;
    padding: 10px;
    border-bottom: 1px solid lightgray;
    cursor: pointer;
    align-items: center;
}

.message-actions div:last-child {
    border: none;
}

.message-actions div span {
    display: inline;
    margin: 0;
}

/* edit message styles */
.edit-message form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
}

.edit-message form div {
    display: flex;
    justify-content: end;
    column-gap: 5px;
}

.edit-message textarea {
    border: 1px solid lightgray;
    border-radius: 5px;
}

.edit-message form button {
    border: none;
    outline: none;
}

.edit-message form .cancel {
    background-color: var(--primary);
}

.edit-message form .submit {
    background-color: var(--dark);
}

</style>