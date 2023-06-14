<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" class="container-fluid">

            <!-- temp: to create chats (to be moved to user profile) -->
        
            <div class="row" id="create-chat">
                <div v-for="(user, index) in users">
                    <div class="add-chat">
                        <span>{{ user.username }}</span>
                        <button :id="index" @click="createChat">Create</button>
                    </div>
                </div>
            </div>
        

            <div class="row">
                <!-- chat list (shows list of chats) -->
                <div class="col-3" id="chatlist-container">
                    <h1 id="chatlist-header">Chats</h1>

                    <div v-if="!dataInitialized">
                        <p>Loading...</p>
                    </div>

                    <ChatListLayout 
                        v-else
                        v-for="chat in chats" 
                        :chat="chat" 
                        :selected="(chat._id == selectedChat._id) && chatSelected" 
                    />
                </div>

                <!-- chat interface (shows messages)-->
                <div class="col-9" id="chat-interface-container">
                    <div id="no-chat-selected" v-if="!chatSelected || !dataInitialized">
                        <h1>Select a chat on the left</h1>
                    </div>

                    <ChatInterfaceLayout 
                        v-else
                        :chat="selectedChat"
                        :messages="selectedChatMessages"
                    />
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
import ObjectID from 'bson-objectid';

export default {
    components: {
        NavSidebar,
        ChatListLayout,
        ChatInterfaceLayout
    },
    data() {
        return {
            chats: [],
            chatSelected: false,
            users: [],
            store: useChatStore(),
            selectedChat: null,
            messages: [],
            dataInitialized: false
        }
    },
    mounted() {
        // this.handleNewTab();
    },
    created() {
        // handle tab opened
        this.handleNewTab();

        // get history data from database
        this.initData();
        
        // initialize values from ChatStore
        this.updateValues();

        // subscribe to ChatStore
        this.subscribeChatStore();

        // get users
        this.getUsers();
        
        // handle tab closed
        window.addEventListener('beforeunload', this.handleCloseTab);
    },
    methods: {
        // when new tab is opened
        handleNewTab() {
            // keep track of tabs opened
            if (!localStorage.tabCount || (localStorage.tabCount == 'NaN')) {
                // initialize tabCount in localStorage
                localStorage.tabCount = 1;
            }
            else {
                // add to tabCount if tabCount exists
                localStorage.tabCount = parseInt(localStorage.tabCount) + 1;
            }
        },
        // handle close tab
        handleCloseTab() {
            // decrease tabCount
            localStorage.tabCount = parseInt(localStorage.tabCount) - 1;

            // if this is the last tab then clear localStorage
            if (localStorage.tabCount <= 0) {
                localStorage.clear();
            }

            // clear session storage
            sessionStorage.clear();
        },
        // get users to set up create chat
        async getUsers() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/all`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then(data => {
                    this.users = data;
                });
            }).catch((error) => {
                console.log(error);
            })
        },
        // create new chat (chat created locally, does not push to database)
        // chat only synced when user sends first message
        // TODO: shift to user profile page
        createChat(e) {
            const targetUser = this.users[e.target.id];

            // check if chat exists
            // if exists: target = existing chat
            // otherwise: target = null
            let target = this.chats.find(chat => chat.targetUserId == targetUser._id) || null;

            // if chat does not exist then create new chat
            if (!target) {
                target = {
                    // create new ObjectID for immediate access
                    _id: new ObjectID().toString(),
                    targetUserId: targetUser._id,
                    name: targetUser.username,
                    pic: targetUser.profile_pic_link
                }

                // store new chat in localChats
                this.store.localChats.push(target);
            }

            // select the created/existing chat
            this.store.currentChat = target;
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

            // update chats array based on the chats in localChats that are not already added
            state.localChats.forEach(chat => {
                if (this.chats.findIndex(addedChat => addedChat._id == chat._id) == -1) {
                    this.chats.push(chat);
                }
            });

            // update selectedChat based on currentChat
            this.selectedChat = state.currentChat;

            // update messages array based on the chats in localMessages that are not already added
            state.localMessages.forEach(message => {
                if (this.messages.findIndex(addedMessage => addedMessage._id == message._id) == -1) {
                    this.messages.push(message);
                }
            });
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
                        this.chats = this.chats.concat(data.chats);
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
                    if (data.messages) {
                        this.messages = this.messages.concat(data.messages);
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
        }
    },
    computed: {
        // extract a list of messages for the selected chat only
        selectedChatMessages() {
            let result = [];

            this.messages.forEach(message => {
                if (message.chat_id == this.selectedChat._id) {
                    result.push(message);
                }
            });

            return result;
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

#main-content .row {
    width: 100%;
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
    padding: 10px;
    border-bottom: 2px solid black;
    margin-bottom: 0;
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