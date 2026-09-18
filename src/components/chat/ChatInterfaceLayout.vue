<template>
    <div id="chat-interface-layout-container">
        <!-- chat interface header, contains the other user's profile picture, username, and status -->
        <div id="chat-interface-header" @click="viewUser" title="View user">
            <!-- other user's profile pic -->
            <div class="profile-pic-container">
                <img class="profile-pic" :src="chat.pic" />
            </div>

            <!-- other user's username and status -->
            <div id="chat-interface-user-info-container">
                <div id="chat-name" class="hide-overflow-text">
                    <span>{{ chat.name }}</span>
                </div>

                <!-- only show if currentStatus is not null (default) -->
                <div id="chat-user-status" v-if="currentStatus">
                    <span>{{ currentStatus }}</span>
                </div>
            </div>
        </div>

        <!-- container for messages in the chat -->
        <div id="chat-interface-messages-container">
            <div id="loading-previous" v-if="loadingPrevious">
                <span>Loading...</span>
            </div>

            <div
                id="chat-interface-messages"
                :class="{ loading: loadingPrevious }"
            >
                <button
                    id="load-previous-messages"
                    @click="loadPreviousMessages"
                    :disabled="loadingPrevious"
                >
                    Load Previous
                </button>

                <div class="no-messages-found" v-if="messages.length <= 0">
                    <p>No messages found.</p>
                </div>

                <div v-else>
                    <ChatMessageLayout
                        v-for="(message, index) in messages"
                        :message="message"
                        :previous_creation_time="previous_creation_time(index)"
                        :previous_is_sender="previous_is_sender(index)"
                        :name="chat.name"
                        :blocked="chat.blocked"
                        :key="index"
                        @edit-message="editMessage"
                        @delete-message="deleteMessage"
                        @reply-to-message="handleReplyMessage"
                        @report-message="handleReportMessage"
                    />
                </div>
            </div>
        </div>

        <!-- show replying to message -->
        <div v-if="replyToMessage">
            <ChatReplyMessageLayout
                :message="replyToMessage"
                :name="chat.name"
                :showClose="true"
                :replying="true"
                @close-reply-to="handleCloseReply"
            />
        </div>

        <!-- container for message input -->
        <div id="chat-interface-input">
            <div v-if="!chat.blocked">
                <form @submit.prevent="sendMessage">
                    <DynamicTextarea
                        title="Enter your message"
                        :id="'chat-message-input'"
                        :maxRows="5"
                        :placeholder="'Message...'"
                        v-model="messageText"
                        @input="updateTypingStatus"
                        @keydown.enter.exact.prevent="sendMessage"
                    />

                    <button
                        title="Add a file"
                        type="button"
                        @click="() => toggleFileInput(true)"
                    >
                        <span class="material-symbols-outlined"
                            >Attach_file</span
                        >
                    </button>

                    <button title="Send message" type="submit">
                        <span
                            class="material-symbols-outlined"
                            id="chat-message-send"
                            >Send</span
                        >
                    </button>
                </form>
            </div>

            <div v-else id="chat-interface-blocked">
                <span>Unable to send messages to this user.</span>
            </div>
        </div>

        <div id="chat-file-upload-container" v-if="!chat.blocked && fileInput">
            <div id="chat-file-upload">
                <span
                    id="close-file-input"
                    class="material-symbols-outlined"
                    @click="() => toggleFileInput(false)"
                    >Close</span
                >

                <form @submit.prevent="sendMessage">
                    <div id="upload-file-container">
                        <!-- input to select file -->
                        <input
                            id="chat-add-file"
                            type="file"
                            title="Add a file"
                            @change="handleFileInput"
                        />
                        <label for="chat-add-file" id="chat-add-file-label">
                            <p>
                                Drag and drop
                                <br />
                                or
                                <br />
                                click <u>here</u> to upload.
                            </p>
                        </label>

                        <!-- inform user about invalid file -->
                        <div v-if="error != ''" id="chat-invalid-file">
                            <span>Error:</span>
                            <br />
                            <span>{{ error }}</span>
                        </div>

                        <!-- preview file -->
                        <div id="preview-file-container" v-if="fileSelected">
                            <span>Selected File:</span>

                            <div>
                                <img
                                    :class="{
                                        'image-preview': isFileImageType,
                                        'unknown-preview': !isFileImageType,
                                    }"
                                    :src="
                                        isFileImageType
                                            ? selectedLink
                                            : '../../assets/unknown-file-icon.png'
                                    "
                                />

                                <span
                                    >{{ file.name }} ({{
                                        calculateSize(file.size)
                                    }})</span
                                >
                            </div>
                        </div>
                    </div>

                    <div
                        id="chat-file-interface-input"
                        v-if="fileSelected && !invalidFile"
                    >
                        <DynamicTextarea
                            title="Enter your message (Optional)"
                            :id="'chat-file-message-input'"
                            :maxRows="5"
                            :placeholder="'Message...'"
                            v-model="messageText"
                            @input="updateTypingStatus"
                            @keydown.enter.exact.prevent="sendMessage"
                        />

                        <button title="Send file" type="submit">
                            <span
                                class="material-symbols-outlined"
                                id="chat-message-send"
                                >Send</span
                            >
                        </button>
                    </div>
                </form>
            </div>

            <LoadingOverlay
                :backgroundColor="'rgba(0, 0, 0, 0.5)'"
                :center="true"
                v-if="isUploadingFile"
            />
        </div>
    </div>

    <ReportFormLayout
        v-if="showReportForm"
        :messageId="reportMessageId"
        :type="'message'"
        @close-report-form="() => toggleReportForm(false)"
    />
</template>

<script>
import ChatMessageLayout from "./ChatMessageLayout.vue";
import { useChatStore } from "../../stores/ChatStore.js";
import { socket } from "../../utils/chat/chatSocket.js";
import ObjectID from "bson-objectid";
import calculateSize from "../../utils/general/formatFileSize.js";
import LoadingOverlay from "../general/LoadingOverlay.vue";
import { useAlertStore } from "../../stores/AlertStore.js";
import DynamicTextarea from "../general/DynamicTextarea.vue";
import viewUser from "../../utils/general/viewUser.js";
import { debounce } from "lodash";
import ChatReplyMessageLayout from "./ChatReplyMessageLayout.vue";
import ReportFormLayout from "../../components/report/ReportFormLayout.vue";

export default {
    data() {
        return {
            status: {
                online: "Online",
                offline: "Offline",
                typing: "Typing...",
            },
            debouncedTypingStatusUpdate: null,
            currentStatus: null,

            messageText: "",
            previousMessageLength: 0,
            loadingPrevious: false,

            fileInput: false,
            file: {},
            error: "",
            selectedLink: "",
            uploadingFile: false,

            replyToMessage: null,

            store: useChatStore(),
            alert: useAlertStore().alert,

            showReportForm: false,
            reportMessageId: null,
        };
    },
    props: ["chat", "messages"],
    components: {
        ChatMessageLayout,
        LoadingOverlay,
        DynamicTextarea,
        ChatReplyMessageLayout,
        ReportFormLayout,
    },
    // when mounted/restored from cache
    activated() {
        // focus on message input
        this.inputFocus();

        // initialize user status and user status listeners
        this.getUserStatus();

        // scroll to bottom of messages
        this.scrollMessagesBottom();

        // set debounce function to tell other user that current user is not typing after 1s from the last input
        this.debouncedTypingStatusUpdate = debounce(() => {
            this.sendTypingStatus(false);
        }, 1000);
    },
    updated() {
        // sroll to bottom of messages when new messages are added
        this.checkChangeMessages();
    },
    // when cached
    deactivated() {
        // clean up socket listeners
        socket.off("update-user-presence", this.updateUserPresence);
        socket.off("receive-user-typing", this.updateUserTyping);
    },
    methods: {
        // to focus on message input field
        inputFocus() {
            const messageInput = document.getElementById("chat-message-input");
            if (messageInput) {
                messageInput.focus();
            }
        },
        // to send message to backend
        async sendMessage() {
            // do nothing if either user blocked the other user
            if (this.chat.blocked) {
                return;
            }

            // if file input mode is inactive,
            // if no message is entered then do nothing
            if (!this.fileInput) {
                if (this.messageText.trim().length <= 0) {
                    return;
                }
            }
            // otherwise
            else {
                // if no file is selected do nothing
                if (!this.fileSelected) {
                    await this.alert("No file selected.");

                    return;
                }

                // if there are any errors do nothing
                if (this.invalidFile) {
                    await this.alert("Invalid file selected.");

                    return;
                }
            }

            // otherwise send the message to the backend
            const newMessage = {
                _id: new ObjectID().toString(),
                content: this.messageText,
                is_sender: true,
                creation_time: new Date().toISOString(),
            };

            // set reply_message property if replyToMessage is not null
            if (this.replyToMessage) {
                newMessage.reply_message = this.replyToMessage;
            }

            // if there are files selected send the files to server in chunks
            if (this.fileInput && this.fileSelected) {
                this.sendFile(newMessage);

                // wait for file upload results
                const uploadResults = await this.receiveFileUploadResults(
                    newMessage._id,
                );

                // if file upload is successful then update file attributes and continue
                if (uploadResults.successful) {
                    newMessage.file_link = uploadResults.fileLink;
                    newMessage.original_name = this.file.name;
                    newMessage.file_type = this.file.type;

                    await this.alert("File upload successful");
                }
                // otherwise tell user file upload failed and return
                else {
                    await this.alert("File upload failed.");

                    return;
                }
            } else {
                socket.emit("send-message", {
                    message: newMessage,
                    chat: this.chat,
                });
            }

            // add message to messages
            newMessage.chat_id = this.chat._id;
            this.store.newMessage(newMessage);

            // update last_message_timestamp
            this.store.updateChatTimestamp(
                this.chat._id,
                newMessage.creation_time,
            );

            // reset fields to default
            this.messageText = "";
            this.replyToMessage = null;

            // toggle file input mode off
            this.toggleFileInput(false);

            // give focus to input field
            this.inputFocus();
        },
        // to process and send file to server
        sendFile(message) {
            this.uploadingFile = true;

            const context = this;
            const reader = new FileReader();

            // set chunk size to 4KB
            const chunkSize = 4 * 1024;

            // process obtained array buffer and send message and file to server
            reader.onload = function () {
                const buffer = reader.result;
                const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

                const file = {
                    name: context.file.name,
                    type: context.file.type,
                    totalChunks: totalChunks,
                };

                socket.emit("send-message", {
                    message: message,
                    chat: context.chat,
                    file: file,
                });

                // send chunks to server
                for (let i = 0; i < totalChunks; i++) {
                    const startByte = i * chunkSize;
                    // set endByte to accommodate files that are not exactly 'n' chunks long
                    const endByte = Math.min(
                        startByte + chunkSize,
                        buffer.byteLength,
                    );
                    const chunk = buffer.slice(startByte, endByte);

                    const chunkData = {
                        message_id: message._id,
                        chunk: chunk,
                    };

                    socket.emit("file-chunk", chunkData);
                }
            };

            // read file as array buffer to process and send to server
            reader.readAsArrayBuffer(this.file);
        },
        // to wait and receive file upload result
        receiveFileUploadResults(messageId) {
            return new Promise((resolve) => {
                // set up event listener to receive file upload results
                socket.on("file-upload-result", (data) => {
                    if (data.messageId == messageId) {
                        // resolve promise with file upload results if received results is for the correct message id
                        this.uploadingFile = false;
                        resolve(data.uploadResult);
                    }
                });
            });
        },
        // to edit message and update backend
        editMessage(data) {
            // do nothing if either user blocked the other user
            if (this.chat.blocked) {
                return;
            }

            socket.emit("edit-message", {
                chat: this.chat,
                message: {
                    _id: data.messageId,
                    content: data.editedMessage,
                    chat_id: this.chat._id,
                    last_modified_time: data.lastModifiedTime,
                },
                targetUserId: this.chat.targetUserId,
            });

            // update edited message's content
            this.store.editMessage(
                this.chat._id,
                data.messageId,
                data.editedMessage,
                data.lastModifiedTime,
            );
        },
        // to delete message and update backend
        deleteMessage(data) {
            // do nothing if either user blocked the other user
            if (this.chat.blocked) {
                return;
            }

            const message = {
                _id: data.messageId,
                chat_id: this.chat._id,
            };

            if (data.fileLink) {
                message.fileLink = data.fileLink;
            }

            socket.emit("delete-message", {
                chat: this.chat,
                message,
                targetUserId: this.chat.targetUserId,
            });

            // remove deleted message from existing messages
            this.store.deleteMessage(this.chat._id, data.messageId);
        },
        // to update user's typing status
        // status changes to typing whenever user presses a key
        // status changes back to after 1s from the last keypress
        updateTypingStatus() {
            // do nothing if either user blocked the other user
            if (this.chat.blocked) {
                return;
            }

            // only update typing status if other user is online
            // if currentStatus is offline or null then do nothing
            if (
                this.currentStatus == this.status.offline ||
                !this.currentStatus
            ) {
                return;
            }

            // tell other user that current user is typing
            this.sendTypingStatus(true);

            this.debouncedTypingStatusUpdate();
        },
        // update the other user that current user is typing/not typing
        sendTypingStatus(typing) {
            socket.emit("user-typing", {
                typing: typing,
                targetUserId: this.chat.targetUserId,
            });
        },
        // get/react to other user's status and set up socket listeners (online/offline/typing)
        getUserStatus() {
            // to query initial user presence
            this.getUserPresence();

            // set listener for update of user's status
            socket.on("update-user-presence", this.updateUserPresence);

            // set listener for update of user's typing status
            socket.on("receive-user-typing", this.updateUserTyping);
        },
        // query server whether user is online or not
        getUserPresence() {
            socket.emit(
                "query-user-presence",
                {
                    targetUserId: this.chat.targetUserId,
                },
                (res) => {
                    // update user status based on server response
                    this.updateOnlineStatus(res.online);
                },
            );
        },
        // set currentStatus based on online parameter value
        updateOnlineStatus(online) {
            if (online) {
                this.currentStatus = this.status.online;
            } else {
                this.currentStatus = this.status.offline;
            }
        },
        // callback for 'update-user-presence' event
        updateUserPresence(data) {
            // only update if both users are not blocking each other
            // if event is for the current target user then update presence status
            if (!this.chat.blocked && data.userId == this.chat.targetUserId) {
                this.updateOnlineStatus(data.online);
            }
        },
        // callback for 'receive-user-typing' event
        updateUserTyping(data) {
            // only update if both users are not blocking each other
            if (!this.chat.blocked && data.userId == this.chat.targetUserId) {
                // if event is for the current target user
                // if user is typing then set status to typing
                if (data.typing) {
                    this.currentStatus = this.status.typing;
                }
                // otherwise query presence and set to user presence
                else {
                    this.getUserPresence();
                }
            }
        },
        // check for change in messages and scroll to bottom
        checkChangeMessages() {
            const messageLength = this.messages.length;

            if (messageLength != this.previousMessageLength) {
                this.scrollMessagesBottom();
            }

            this.previousMessageLength = messageLength;
        },
        // scroll to bottom of chat messages
        scrollMessagesBottom() {
            const messageContainer = document.getElementById(
                "chat-interface-messages-container",
            );
            messageContainer.scrollBy(0, messageContainer.scrollHeight);
        },
        // load more messages stored in database
        async loadPreviousMessages() {
            this.loadingPrevious = true;
            const encodedTimestamp = encodeURIComponent(
                this.messages[0].creation_time,
            );

            // send request to backend to get previous messages
            await fetch(
                `${process.env.APP_SERVER_URL}/api/chats/${
                    this.chat._id
                }/${encodedTimestamp}/100`,
                {
                    method: "GET",
                    credentials: "include",
                    mode: "cors",
                },
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        if (data.messages) {
                            if (data.messages.length > 0) {
                                // if there are more history messages
                                // update message list with previous messages
                                this.store.newMessageBulk(
                                    data.messages,
                                    this.chat._id,
                                );
                            } else {
                                // if there are no more history messages then tell user no more messages found
                                await this.alert("No more messages found.");
                            }
                        } else {
                            await this.alert("Could not retrieve messages.");
                        }
                    });
                })
                .catch((error) => {
                    void error;
                });

            this.loadingPrevious = false;
        },
        // get creation_time of previous message or '' if it is the first message
        previous_creation_time(index) {
            return index == 0 ? "" : this.messages[index - 1].creation_time;
        },
        // get is_sender of previous message or null if it is the first message
        previous_is_sender(index) {
            return index == 0 ? null : this.messages[index - 1].is_sender;
        },
        // to handle file input
        handleFileInput(e) {
            // if no file is selected then set file back to empty object and do nothing
            if (!e.target.files[0]) {
                this.file = {};
                return;
            }

            // set file
            this.file = e.target.files[0];

            // clear error
            this.error = "";
            this.selectedLink = "";

            // valid conditions
            const maxFileSize = 2 * 1024 * 1024;

            // error messages
            const largeFileError = `File is too large, maximum file size is ${
                maxFileSize / 1024 / 1024
            }MB.`;

            // check for large file
            if (this.file.size > maxFileSize) {
                this.error = largeFileError;
            }

            // do nothing if the file is too large
            if (this.invalidFile) {
                return;
            }

            //add link to preview file
            // for images create object URL for preview
            // for non-images use default unknown file icon
            if (this.file.type.startsWith("image/")) {
                this.selectedLink = URL.createObjectURL(this.file);
            }
        },
        // to toggle file input
        toggleFileInput(show) {
            // set file related fields to default
            this.file = {};
            this.selectedLink = "";
            this.error = "";

            this.fileInput = show;
        },
        // to format size of file for display
        calculateSize(bytes) {
            return calculateSize(bytes);
        },
        // to view user profile of the other chat member
        viewUser() {
            viewUser(this.chat.targetUserId);
        },
        // handle reply-to-message event
        handleReplyMessage(message) {
            this.replyToMessage = message;
            this.inputFocus();
        },
        // handle close-reply-to event
        handleCloseReply() {
            this.replyToMessage = null;
        },
        // to show/hide report form
        toggleReportForm(show) {
            this.showReportForm = show;
        },
        // to report a message
        handleReportMessage(messageId) {
            this.reportMessageId = messageId;

            this.toggleReportForm(true);
        },
    },
    computed: {
        // check if a file is selected
        fileSelected() {
            return this.file.size;
        },
        // check if selected file is invalid
        invalidFile() {
            return this.error != "";
        },
        // check if selected file is image type
        isFileImageType() {
            return this.file.type.startsWith("image/");
        },
        // check if file upload is in progress
        isUploadingFile() {
            return this.uploadingFile;
        },
    },
};
</script>

<style>
/* container styles */
#chat-interface-layout-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}

/* chat interface header styles */
#chat-interface-header {
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid black;
    column-gap: 15px;
    width: 100%;
    user-select: none;
    cursor: pointer;
}

#chat-interface-header:hover #chat-name {
    color: var(--primary);
}

.profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 50px;
    width: 50px;
}

#chat-interface-user-info-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
}

#chat-name {
    font-size: 1.2em;
    font-weight: 600;
}

#chat-user-status {
    font-size: 0.8em;
}

/* message container styles */
#chat-interface-messages-container {
    flex: 1;
    overflow-y: auto;
    position: relative;
}

#chat-interface-messages {
    padding: 15px;
}

#chat-interface-messages.loading {
    opacity: 0.7;
}

#loading-previous {
    position: absolute;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    height: 100%;
    width: 100%;
}

#loading-previous span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#load-previous-messages {
    border-radius: 20px;
    padding: 10px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 20px;
}

#load-previous-messages:hover {
    opacity: 0.7;
}

.no-messages-found {
    font-size: 1.2em;
    margin: 10px;
    text-align: center;
    font-style: italic;
}

/* input styles */
#chat-interface-input {
    border-top: 1px solid lightgray;
    padding: 15px;
}

#chat-interface-blocked {
    font-style: italic;
    text-align: center;
}

#chat-interface-input form,
#chat-file-interface-input {
    display: flex;
    column-gap: 5px;
    border: 1px solid black;
    border-radius: 70px;
    padding: 5px;
    padding-left: 25px;
    align-items: center;
    background-color: white;
    flex-direction: row;
}

#chat-interface-input form textarea,
#chat-file-interface-input textarea {
    padding: 0px 5px;
}

#chat-message-input,
#chat-file-message-input {
    outline: none;
    border: none;
    width: 100%;
    background-color: transparent;
}

#chat-interface-input button,
#chat-file-upload-container button {
    border: none;
    outline: none;
    background-color: transparent;
}

#chat-interface-input .material-symbols-outlined,
#chat-file-upload-container .material-symbols-outlined {
    color: black;
    font-size: 2em;
}

/* file input styles */
#chat-file-upload-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: 100%;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

#chat-file-upload {
    background-color: var(--dark);
    padding: 15px;
    border-radius: 20px;
    min-width: 50%;
    max-width: 75%;
    max-height: 75%;
    position: relative;
    overflow: auto;
    display: flex;
    flex-direction: column;
}

#chat-file-upload .container-fluid,
#chat-file-upload .row {
    padding: 0;
    margin: 0;
}

#close-file-input {
    color: white !important;
    width: fit-content;
    position: relative;
    left: 100%;
    margin: 0;
    transform: translateX(-100%);
}

#chat-file-upload form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
}

#upload-file-container {
    background-color: white;
    padding: 20px;
    border-radius: 15px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
}

#chat-add-file {
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
}

#chat-add-file-label {
    cursor: pointer;
    text-align: center;
    margin: 0 auto;
    width: 75%;
    border-bottom: 1px solid lightgray;
}

#chat-invalid-file {
    color: red;
    font-style: italic;
    text-align: center;
}

#preview-file-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 10px;
}

#preview-file-container div {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
}

.image-preview {
    width: 150px;
    height: 100px;
    object-fit: cover;
}

.unknown-preview {
    max-width: 30px;
}
</style>
