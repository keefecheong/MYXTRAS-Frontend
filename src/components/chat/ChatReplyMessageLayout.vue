<template>
    <div class="reply-to-message-container" :class="{ 'replying': replying }">
        <div class="reply-message-content-container" :class="{ 'self': message.is_sender }" @click="viewOriginal">
            <span class="reply-message-name hide-overflow-text">{{ message.is_sender ? 'You' : name }}</span>

            <ChatFileLayout
                v-if="message.file_link"
                :fileLink="message.file_link"
                :originalName="message.original_name"
                :fileType="message.file_type"
                class="reply-to-message-file"
            />

            <span class="reply-message-content hide-overflow-text">{{ message.content }}</span>
        </div>
        
        <div class="close-reply-message-container" v-if="showClose">
            <span class="material-symbols-outlined" title="Close" @click="closeReplyTo">close</span>
        </div>
    </div>
</template>

<script>
import ChatFileLayout from './ChatFileLayout.vue';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            debouncedClearAnimation: null
        }
    },
    props: [
        'message',
        'showClose',
        'name',
        'replying'
    ],
    emits: [
        'close-reply-to'
    ],
    components: {
        ChatFileLayout
    },
    methods: {
        // to close reply to layout (when replying)
        closeReplyTo() {
            this.$emit('close-reply-to');
        },
        // to scroll to the original message
        viewOriginal() {
            const target = document.getElementById(this.message._id);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                const className = this.message.is_sender ? 'highlight-self' : 'highlight-other';

                if (!this.debouncedClearAnimation) {
                    this.debouncedClearAnimation = debounce(() => {
                        target.classList.remove(className);
                    }, 1000);
                }
                
                target.classList.add(className);

                this.debouncedClearAnimation();
            }
        }
    }
}
</script>

<style>
.reply-to-message-container {
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: center;
    margin: 5px 0;
}

.reply-to-message-container.replying {
    padding: 10px 35px 10px 15px;
    background-color: var(--dark);
}

.reply-message-content-container {
    color: white;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-left: 5px solid var(--secondary);
    border-radius: 10px;
    padding: 2px 5px;
    background-color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
}

.reply-message-content-container.self {
    border-left-color: var(--primary);
}

.reply-message-name {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--secondary);
}

.reply-message-content-container.self > .reply-message-name {
    color: var(--primary);
}

.reply-message-content {
    -webkit-line-clamp: 2 !important;
}

.close-reply-message-container .material-symbols-outlined {
    font-size: 1.5em;
}

@keyframes highlight-self {
    from {
        background-color: rgba(226, 34, 98, 0.1);
    }

    to {
        background-color: none;
    }
}

@keyframes highlight-other {
    from {
        background-color: rgba(255, 99, 99, 0.15);
    }

    to {
        background-color: none;
    }
}
</style>