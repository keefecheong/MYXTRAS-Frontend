<template>
    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" class="container-fluid">       
            <div class="row">
                <!-- chat list (shows list of chats) -->
                <div class="col-3" id="chatlist-container">
                    <h1 id="chatlist-header">Chats</h1>

                    <div class="chatlist-placeholder" v-if="!dataInitialized">
                        <p>Loading...</p>
                    </div>

                    <div class="chatlist-placeholder" v-if="dataInitialized && orderedChats.length <= 0">
                        <p>No chats found</p>
                    </div>

                    <div v-if="dataInitialized && orderedChats.length > 0">
                        <ChatListLayout 
                            v-for="chat in orderedChats" 
                            :chat="chat" 
                            :selected="chatSelected && (chat._id == selectedChat._id)" 
                        />
                    </div>
                </div>

                <!-- chat interface (shows messages)-->
                <div class="col-9" id="chat-interface-container">
                    <div id="no-chat-selected" v-if="!chatSelected || !dataInitialized">
                        <h1>Select a chat on the left</h1>
                    </div>

                    <div v-else style="height: 100%">
                        <keep-alive>
                            <ChatInterfaceLayout 
                                :key="selectedChat._id"
                                :chat="selectedChat"
                                :messages="selectedChatMessages"
                            />
                        </keep-alive>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import ChatListLayout from '../../components/chat/ChatListLayout.vue';
import ChatInterfaceLayout from '../../components/chat/ChatInterfaceLayout.vue';
import { useChatStore } from '../../stores/ChatStore.js';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';

export default {
    components: {
        NavSidebar,
        ChatListLayout,
        ChatInterfaceLayout,
        AlertPrompt
    },
    data() {
        return {
            chatSelected: false,
            users: [],
            store: useChatStore(),
            dataInitialized: false,
            retrievedChatIds: [],
            alertStore: useAlertStore()
        }
    },
    async created() {
        // get history data from database
        await this.initData();
        
        // initialize values from ChatStore
        this.updateValues();

        // subscribe to ChatStore
        this.subscribeChatStore();
        
        // check for new store/selected store
        this.initChat();
    },
    methods: {
        // check for new chat/selected chat set from profile page
        initChat() {
            var selectedChat = sessionStorage.getItem('selectedChat');

            // check if selectedChat is set
            if (selectedChat) {
                selectedChat = JSON.parse(selectedChat);

                // add chat to store if does not already exist
                if (!this.store.chats.some(chat => chat.targetUserId == selectedChat.targetUserId)) {
                    this.store.chats.push(selectedChat);
                }

                // set currentChat to selectedChat
                this.store.currentChat = selectedChat;
            }

            sessionStorage.removeItem('selectedChat');
        },
        // subscribe to changes in ChatStore
        subscribeChatStore() {
            this.store.$subscribe((mutation, state) => {
                this.updateValues(state);
            });
        },
        // used to initialize/update values on load/store value changes
        updateValues(state = this.store) {
            // update chatSelected based on whether currentChat is empty
            this.chatSelected = JSON.stringify(state.currentChat) != JSON.stringify({});

            if (this.chatSelected) {
                // if messages of currentChat have not been retrieved yet then query stored messages for the chat
                if (!this.retrievedChatIds.some(chatId => chatId == state.currentChat._id)) {
                    this.retrieveMessages(state.currentChat._id);
                }
            }
        },
        // used to get existing chats and latest messages from top 5 recently used chats
        async initData() {
            // request to get user's chats
            const chatRequest = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chats`, {
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (data.chats) {
                        this.store.newChatBulk(data.chats);
                    }
                    else {
                        console.log('Could not retrieve chats.');
                    }
                });
            });

            // request to get latest 50 messages from user's last 5 used chats
            const messageRequest = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chats/latestMessages`, {
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (data.data) {
                        for (const key in data.data) {
                            if (data.data.hasOwnProperty(key)) {
                                // update messages with the retrieved messages
                                this.store.newMessageBulk(data.data[key], key);

                                // update retrievedChatIds with the chat ids for which the messages above have been retrieved
                                this.retrievedChatIds.push(key);
                            }
                        }
                    }
                    else {
                        console.log('Could not retrieve messages.');
                    }
                });
            });

            // send both requests together
            await Promise.all([
                chatRequest,
                messageRequest
            ]).then((res) => {
                this.dataInitialized = true;
            }).catch((error) => {
                console.log(error);
            });
        },
        // send request to retrieve up to 50 stored messages for specified chat
        async retrieveMessages(chatId) {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chats/${chatId}/50`, {
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (data.messages) {
                        // update messages with the retrieved messages
                        // check if any of the messages retrieved already exist locally
                        this.store.newMessageBulk(data.messages, chatId);

                        // update retrievedChatIds with the chat id requested
                        this.retrievedChatIds.push(chatId);
                    }
                    else {
                        console.log('Could not retrieve messages.');
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
    },
    computed: {
        // get currentChat from store
        selectedChat() {
            return this.store.currentChat;
        },
        // extract a list of messages for the selected chat only
        selectedChatMessages() {
            return this.store.messages[this.selectedChat._id] || [];
        },
        // order chats in descending last_message_timestamps
        orderedChats() {
            return this.store.chats.sort((a, b) => {
                const timestampA = new Date(a.last_message_timestamp);
                const timestampB = new Date(b.last_message_timestamp);

                return timestampB - timestampA;
            });
        },
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

/* general styles */
#main-content {
    display: flex;
    flex-direction: row;
}

#main-content .row > div {
    padding: 0;
}

/* chat list styles */
#chatlist-container {
    border-right: 1px solid lightgray;
    max-height: 100vh;
    overflow-y: auto;
}

#chatlist-header {
    background-color: var(--primary);
    color: white;
    padding: 11px;
    border-bottom: 2px solid black;
    margin-bottom: 0;
}

.chatlist-placeholder {
    font-size: 1.3em;
    margin: 10px;
    text-align: center;
    font-style: italic;
}

/* chat interface styles */
#chat-interface-container {
    position: relative;
    max-height: 100vh;
}

/* center no-chat-selected div */
#no-chat-selected {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* temp styles for chat creation */
/* once taken away the interface will be normal height */
#main-content {
    flex-direction: column;
}

#create-chat {
    display: flex;
    column-gap: 5px;
    flex-direction: row;
    border: 1px dashed black;
}

#create-chat div {
    width: fit-content;
    padding: 5px;
    display: flex;
    column-gap: 5px;
    align-items: center;
}

#main-content .row:last-child {
    height: 100%;
}
</style>

<style scoped>
/* to get rid of column between sidebar and chat */
#main-container {
    column-gap: 0;
}
</style>