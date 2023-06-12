<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" class="container-fluid">

            <!-- temp: to create chats (to be moved to user profile) -->
            <!--
                <div class="row" id="create-chat">

                </div>
            -->

            <div class="row">
                <!-- chat list (shows list of chats) -->
                <div class="col-3" id="chatlist-container">
                    <h1 id="chatlist-header">Chats</h1>

                    <ChatListLayout v-for="chat in chats" :chat="chat" />
                </div>

                <!-- chat interface (shows messages)-->
                <div class="col-9" id="chat-interface-container">
                    <div id="no-chat-selected" v-if="!chatSelected">
                        <h1>Select a chat on the left</h1>
                    </div>

                    <ChatInterfaceLayout v-else />
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
import { watch } from 'vue';

export default {
    components: {
        NavSidebar,
        ChatListLayout,
        ChatInterfaceLayout
    },
    data() {
        return {
            chats: [
                {
                    id: '1',
                    name: 'user 1',
                    pic: 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'
                },
                {
                    id: '2',
                    name: 'user 2',
                    pic: 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'
                }
            ],
            chatSelected: false
        }
    },
    created() {
        // initialize chatSelected
        const store = useChatStore();

        // listen for changes of currentChat in ChatStore
        watch(
            () => store.currentChat, 
            (newValue) => {
                this.chatSelected = JSON.stringify(store.currentChat) != JSON.stringify({});
            },
            {
                immediate: true
            }
        );

        // clear chat store when the page is closed
        window.addEventListener('beforeunload', this.clearChatStore);
    },
    methods: {
        // clear chat store
        clearChatStore() {
            const store = useChatStore();
            store.currentChat = {};
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
</style>