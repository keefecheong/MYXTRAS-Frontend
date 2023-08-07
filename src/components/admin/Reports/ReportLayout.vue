<!-- layout for reports -->

<template>
    <div class="parent-layout-container">
        <div
            v-for="i in ['header', 'value']"
            class="layout-container"
            :class="{ 'header': i == 'header', 'display-header': index == 0 }"
        >

            <div>
                <span class="hide-overflow-text flex-10" :title="displayType[i]">{{ displayType[i] }}</span>

                <span class="hide-overflow-text flex-15" v-if="!fromProfile" :title="displayTarget[i]">{{ displayTarget[i] }}</span>

                <span class="hide-overflow-text flex-10" v-if="aggregated && !reviewed" :title="displayCount[i]">{{ displayCount[i] }}</span>

                <span class="hide-overflow-text flex-10" :title="displayOwner[i]">{{ displayOwner[i] }}</span>

                <span class="hide-overflow-text flex-10" v-if="!reviewed && !fromProfile" :title="displayReporter[i]">{{ displayReporter[i] }}</span>

                <span class="hide-overflow-text flex-15" v-if="!reviewed" :title="displayReportTime[i]">{{ displayReportTime[i] }}</span>

                <span class="hide-overflow-text flex-10" :title="displayStatus[i]">{{ displayStatus[i] }}</span>

                <span class="hide-overflow-text flex-10" v-if="reviewed" :title="displayReviewer[i]">{{ displayReviewer[i] }}</span>

                <span class="hide-overflow-text flex-15" v-if="reviewed" :title="displayReviewTime[i]">{{ displayReviewTime[i] }}</span>

            </div>

            <button class="details-button use-primary-secondary-gradient" title="View report details" @click="viewDetails">Details</button>
        </div>

    </div>
</template>

<script>
import getFormattedTime from '../../../utils/general/getFormattedTime.js';

export default {
    props: [
        'report',
        'aggregated',
        'fromProfile',
        'index'
    ],
    emits: [
        'view-report-details'
    ],
    computed: {
        // check if report is reviewed
        reviewed() {
            return this.report.status != 'Submitted';
        },
        // return header and value for type of object reported
        displayType() {
            return { 
                header: 'Type',
                value : this.report.report_target_type
            };
        },
        // return header and value for id of object reported
        displayTarget() {
            return {
                header: 'Reported Object',
                value: this.aggregated ? this.report._id : this.report.report_target
            };
        },
        // return header and value for number of reports made for this object
        displayCount() {
            return {
                header: 'Reports',
                value: this.report.count
            };
        },
        // return header and value for username of the owner of the object
        displayOwner() {
            return { 
                header: 'Object Owner',
                value: this.report.report_target_owner.username
            };
        },
        // return header and value for the type of reporter (user/ai)
        displayReporter() {
            return {
                header: 'Reported By',
                value: this.report.reporter.subject.join(', ')
            };
        },
        // return header and value for the reporting time
        displayReportTime() {
            return {
                header: 'Report Time',
                value: this.getTimeToDisplay(this.report.report_time)
            };
        },
        // return header and value for the status of the report
        displayStatus() {
            return {
                header: 'Status',
                value: this.report.status
            };
        },
        // return header and value for the username of the admin who reviewed the report
        displayReviewer() {
            return {
                header: 'Reviewed By',
                value: this.report.reviewer_id?.username
            };
        },
        // return header and value for the review time
        displayReviewTime() {
            return {
                header: 'Review Time',
                value: this.getTimeToDisplay(this.report.review_time)
            };
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