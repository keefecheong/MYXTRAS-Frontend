<!-- layout for reports -->

<template>
    <div class="report-layout-container layout-container" :class="{ 'header': header }">
        <div>
            <span class="hide-overflow-text flex-10" :title="displayType">{{ displayType }}</span>
            <span class="hide-overflow-text flex-15" v-if="!reviewed" :title="displayTarget">{{ displayTarget }}</span>
            <span class="hide-overflow-text flex-20" v-if="!reviewed" :title="displayParent">{{ displayParent }}</span>
            <span class="hide-overflow-text flex-5" v-if="aggregated" :title="displayCount">{{ displayCount }}</span>
            <span class="hide-overflow-text flex-15" :title="displayOwner">{{ displayOwner }}</span>
            <span class="hide-overflow-text flex-15" v-if="!reviewed" :title="displayReportTime">{{ displayReportTime }}</span>

            <span class="hide-overflow-text flex-10" v-if="reviewed" :title="displayStatus">{{ displayStatus }}</span>
            <span class="hide-overflow-text flex-15" v-if="reviewed" :title="displayReviewer">{{ displayReviewer }}</span>
            <span class="hide-overflow-text flex-15" v-if="reviewed" :title="displayReviewTime">{{ displayReviewTime }}</span>
        </div>

        <button class="details-button use-primary-secondary-gradient" @click="viewDetails">Details</button>
    </div>
</template>

<script>
import getFormattedTime from '../../../utils/general/getFormattedTime.js';

export default {
    inject: [
        'REPORT_TARGET_TYPE_COMMENT',
        'REPORT_TARGET_TYPE_THREAD',
        'REPORT_TARGET_TYPE_MESSAGE'
    ],
    props: [
        'header',
        'report',
        'aggregated',
        'reviewed'
    ],
    emits: [
        'view-report-details'
    ],
    computed: {
        displayType() {
            return this.header ? 'Type' : this.report.report_target_type;
        },
        displayTarget() {
            return this.header ? 'Reported Object' : (
                this.aggregated ? this.report._id : this.report.report_target
            );
        },
        displayParent() {
            if (this.header) return 'Parent Object';

            switch (this.report.report_target_type) {
                case this.REPORT_TARGET_TYPE_COMMENT:
                    return `${this.report.meta.comment_parent_type} - ${this.report.meta.post_id || this.report.meta.thread_id}`;

                case this.REPORT_TARGET_TYPE_THREAD:
                    return `Forum - ${this.report.meta.forum_id}`;

                case this.REPORT_TARGET_TYPE_MESSAGE:
                    return `Chat - ${this.report.meta.chat_id}`;
            }

            return 'NA';
        },
        displayCount() {
            return this.header ? 'Reports' : this.report.count;
        },
        displayOwner() {
            return this.header ? 'Object Owner' : this.report.report_target_owner_username;
        },
        displayReportTime() {
            return this.header ? 'Report Time' : this.getTimeToDisplay(this.report.report_time);
        },
        displayStatus() {
            return this.header ? 'Status' : this.report.status;
        },
        displayReviewer() {
            return this.header ? 'Reviewed By' : this.report.reviewer_username;
        },
        displayReviewTime() {
            return this.header ? 'Review Time' : this.getTimeToDisplay(this.report.review_time);
        }
    },
    methods: {
        // to open report details
        viewDetails() {
            this.$emit('view-report-details');
        },
        // get time string for display
        getTimeToDisplay(timeString) {
            return getFormattedTime(timeString);
        }
    }
}
</script>