import { defineStore } from 'pinia';
import { useLocalStorage, useSessionStorage } from '@vueuse/core';

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        // use sessionStorage to persist currentChat for each tab over refresh (can be different on each open tab)
        // currentChat stores the chat that user is currently interacting with
        currentChat: useSessionStorage('currentChat', {}),
        
        // chats store the chats enrolled by the user
        chats: useLocalStorage('chats', []),

        // messages store the messages associated with the chats in 'chats'
        messages: {}
        // sample format
        // messages: {
        //     'chat_id_1': [
        //         {
        //             message1
        //         },
        //         {
        //             message2
        //         }
        //     ],
        //     'chat_id_2': []
        // }
    }),
    actions: {
        // check if specified chat exists
        // return chat if exists and null otherwise
        chatExists(chat_id) {
            return this.chats.find(chat => chat._id == chat_id) || null;
        },
        // check if a message array exists for the specified chat id
        // if does not exist, initialize as empty array
        initMessages(chat_id) {
            if (!this.messages.hasOwnProperty(chat_id)) {
                this.messages[chat_id] = [];
            }
        },
        // check if passed chat exists and only add to chats if does not exist
        newChat(chat) {
            const existingChat = this.chatExists(chat._id);

            if (!existingChat) {
                this.chats.push(chat);

                // initialize messages as empty array
                this.initMessages(chat._id);
            }
            else {
                // if the same chat id already exists, check if the last_message_timestamps are the same
                // use the latest last_message_timestamp
                const currentTimestamp = new Date(existingChat.last_message_timestamp);
                const newTimestamp = new Date(chat.last_message_timestamp);

                if (newTimestamp - currentTimestamp > 0) {
                    existingChat.last_message_timestamp = chat.last_message_timestamp;
                }
            }
        },
        // receives an array of chats and only add those that do not already exist to chats
        newChatBulk(chats) {
            const nonConflictingChats = chats.filter(chat => !this.chats.some(existingChat => existingChat._id == chat._id));
            this.chats = this.chats.concat(nonConflictingChats);

            nonConflictingChats.forEach(chat => {
                this.initMessages(chat._id);
            });
        },
        // check if passed message exists and only add to messages if does not exist
        newMessage(message) {
            // initialize messages array
            this.initMessages(message.chat_id);

            if (!this.messages[message.chat_id].some(addedMessage => addedMessage._id == message._id)) {
                this.messages[message.chat_id].push(message);
            }
        },
        // receives an array of messages and only add those that do not already exist to messages
        newMessageBulk(messages, chatId) {
            // initialize messages array
            this.initMessages(chatId);

            const nonConflictingMessages = messages.filter(message => !this.messages[chatId].some(existingMessage => existingMessage._id == message._id));
            this.messages[chatId] = this.messages[chatId].concat(nonConflictingMessages);

            // sort messages by timestamp
            this.messages[chatId].sort((a, b) => {
                const timestampA = new Date(a.creation_time);
                const timestampB = new Date(b.creation_time);

                return timestampA - timestampB;
            });
        },
        // check if specified message exists and update content if exists
        editMessage(chatId, messageId, content, lastModifiedTime) {
            const existingMessage = this.messages[chatId].find(message => message._id == messageId) || null;

            if (existingMessage) {
                existingMessage.content = content;
                existingMessage.last_modified_time = lastModifiedTime;
            }
        },
        // remove specified message if exists
        deleteMessage(chatId, messageId) {
            const existingIndex = this.messages[chatId].findIndex(message => message._id == messageId);
            
            if (existingIndex != -1) {
                this.messages[chatId].splice(existingIndex, 1);
            }
        },
        // update the last_message_timestamp for a chat
        updateChatTimestamp(chatId, timestamp) {
            this.chats.find(chat => chat._id == chatId).last_message_timestamp = timestamp;
        }
    }
});