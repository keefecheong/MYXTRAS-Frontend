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
                'arrow-left': isFirstMessage && !message.is_sender,
                'arrow-right': isFirstMessage && message.is_sender
            }"
        >
            <span>{{ message.content }}</span>
            <span class="message-timestamp">{{ timestamp }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'message',
        'previous_is_sender',
        'previous_creation_time'
    ],
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
        }
    }
}
</script>

<style>
/* date styles */
.new-message-date {
    font-weight: 600;
    text-align: center;
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
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 5px;
    position: relative;
    display: grid;
}

.message.received {
    justify-self: start;
    margin-left: 20px;
}

.message.sent {
    justify-self: end;
    margin-right: 20px;
}

.message.arrow-left, .message.arrow-right {
    margin-top: 20px;
}

.message.arrow-left:after {
    content: '';
    position: absolute;
    left: -15px;
    top: 5px;
    border-top: 5px solid transparent;
    border-right: 15px solid black;
    border-left: none;
    border-bottom: 5px solid transparent;
}

.message.arrow-right:after {
    content: '';
    position: absolute;
    right: -15px;
    top: 5px;
    border-top: 5px solid transparent;
    border-right: none;
    border-left: 15px solid black;
    border-bottom: 5px solid transparent;
}

/* arrow symbols from: https://codeconvey.com/css-message-box-with-arrow/ */

.message-timestamp {
    justify-self: end;
    font-size: 0.8em;
}

</style>