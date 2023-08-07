<!-- layout for warnings -->

<template>
    <div class="detailed-layout-content-container">
        <div v-if="warning.object_type != 'User'">
            <div v-if="admin">
                <span>Content ID:</span>
                <span>{{ warning.object_id }}</span>
            </div>

            <div>
                <span>Content Type:</span>
                <span>{{ warning.object_type }}</span>
            </div>

            <div v-if="warning.file_name">
                <span>File Name:</span>
                <span>{{ warning.file_name }}</span>
            </div>

            <div v-if="warning.content">
                <span>Content:</span>
                <span>{{ warning.content }}</span>
            </div>

            <div>
                <span>Content Creation Time:</span>
                <span>{{ getTimeToDisplay(warning.object_creation_time) }}</span>
            </div>
        </div>

        <div v-else>
            <div>
                <span style="flex: 100%; text-align: center;">You have been reported</span>
            </div>
        </div>

        <div>
            <div>
                <span>Report Reason:</span>
                <span>{{ warning.reason }}</span>
            </div>

            <div v-if="admin">
                <span>Reviewer Username:</span>
                <span>{{ warning.reviewer_id.username }}</span>
            </div>

            <div v-if="admin">
                <span>Reviewer ID:</span>
                <span>{{ warning.reviewer_id._id }}</span>
            </div>

            <div>
                <span>Reviewed Time:</span>
                <span>{{ getTimeToDisplay(warning.review_time) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import getFormattedTime from '../../../utils/general/getFormattedTime.js';

export default {
    props: [
        'warning',
        'admin'
    ],
    methods: {
        getTimeToDisplay(timeString) {
            return getFormattedTime(timeString);
        }
    }
}
</script>

<style scoped>
.detailed-layout-content-container {
    margin-bottom: 0;

    > div:last-child {
        padding-bottom: 15px;
        border-bottom: 1px solid lightgray;
    }
}
</style>