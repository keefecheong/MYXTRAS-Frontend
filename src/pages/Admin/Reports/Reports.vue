<template>
    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt v-if="showConfirm && confirmMsg.length > 0" @close-confirm="closeConfirm">
        {{ confirmMsg }}
    </ConfirmPrompt>

    <div id="main-container">
        <NavSidebar :forAdmin="true" />

        <div id="main-content">
            <AdminBanner>
                <template v-slot:header>
                    <h1>Reports</h1>
                </template>

                <template v-slot:right-content>
                    <div class="banner-toggle-container">
                        <button class="use-primary-secondary-gradient details-button hover-contrast" :class="{ 'active': !viewReviewed }" title="View pending reports" @click="() => toggleReviewed(false)">Pending</button>
                        <button class="use-primary-secondary-gradient details-button hover-contrast" :class="{ 'active': viewReviewed }" title="View reviewed reports" @click="() => toggleReviewed(true)">Reviewed</button>
                    </div>
                </template>
            </AdminBanner>

            <div v-if="reportsToDisplay.length > 0 && !viewDetails">
                <ReportLayout :header="true" :aggregated="true" :reviewed="viewReviewed" />

                <div v-for="(report, index) in reportsToDisplay">
                    <ReportLayout
                        :header="false"
                        :report="report"
                        :aggregated="true"
                        :reviewed="viewReviewed"
                        :key="report._id"
                        @view-report-details="() => toggleReportDetails(true, index)"
                    />
                </div>
            </div>

            <ReportDetailsLayout
                v-if="viewDetails"
                :report="reportsToDisplay[viewDetailsIndex]"
                :aggregated="true"
                :reviewed="viewReviewed"
                @close-report-details="handleCloseReportDetails"
            />

            <div v-if="reportsToDisplay.length <= 0">
                <p class="no-items">No reports found</p>
            </div>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
import AdminBanner from '../../../components/admin/AdminBanner.vue';
import ReportLayout from '../../../components/admin/Reports/ReportLayout.vue';
import ReportDetailsLayout from '../../../components/admin/Reports/ReportDetailsLayout.vue';
import AlertPrompt from '../../../components/general/AlertPrompt.vue';
import ConfirmPrompt from '../../../components/general/ConfirmPrompt.vue';
import { useAlertStore } from '../../../stores/AlertStore.js';
import { useConfirmStore } from '../../../stores/ConfirmStore.js';

export default {
    provide: {
        REPORT_TARGET_TYPE_USER: 'User',
        REPORT_TARGET_TYPE_POST: 'Post',
        REPORT_TARGET_TYPE_FORUM: 'Forum',
        REPORT_TARGET_TYPE_THREAD: 'Thread',
        REPORT_TARGET_TYPE_COMMENT: 'Comment',
        REPORT_TARGET_TYPE_POST_COMMENT: 'postComment',
        REPORT_TARGET_TYPE_THREAD_COMMENT: 'threadComment',
        REPORT_TARGET_TYPE_MESSAGE: 'Message',
    },
    data() {
        return {
            pendingReports: [],
            reviewedReports: [],

            viewDetails: false,
            viewDetailsIndex: null,
            viewReviewed: false,
            
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore()
        }
    },
    components: {
        NavSidebar,
        AdminBanner,
        ReportLayout,
        ReportDetailsLayout,
        AlertPrompt,
        ConfirmPrompt
    },
    created() {
        this.getReports();
    },
    methods: {
        // to get reports
        async getReports() {
            const baseURL = `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/report`;
            const options = {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            };

            const getPending = fetch(`${baseURL}/pending`, options).then(async res => {
                await res.json().then(data => {
                    this.pendingReports = data;
                });
            });

            const getReviewed = fetch(`${baseURL}/reviewed`, options).then(async res => {
                await res.json().then(data => {
                    this.reviewedReports = data;
                });
            });

            await Promise.all([getPending, getReviewed]).catch(error => console.log('Could not retrieve reports.'));
        },
        // to view report details
        toggleReportDetails(show, index) {
            this.viewDetails = show;
            this.viewDetailsIndex = index;
        },
        // close report details, and if the report is resolved remove from reports
        handleCloseReportDetails(resolved) {
            this.toggleReportDetails(false);
            
            if (resolved) {
                this.reports.splice(this.viewDetailsIndex, 1);
            }
        },
        // to toggle between pending and reviewed reports
        toggleReviewed(showReviewed) {
            this.toggleReportDetails(false);
            this.viewReviewed = showReviewed;
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // to close confirm prompt
        closeConfirm(decision) {
            this.confirmStore.closeConfirm(decision);
        }
    },
    computed: {
        // to get list of reports to display
        reportsToDisplay() {
            return this.viewReviewed ? this.reviewedReports : this.pendingReports;
        },
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        },
        // to get showConfirm value
        showConfirm() {
            return this.confirmStore.showConfirm;
        },
        // to get confirmMsg value
        confirmMsg() {
            return this.confirmStore.confirmMsg;
        }
    }
}
</script>

<style>
@import url('../../../styles/main.css');
@import url('../../../styles/admin/common-admin-entry-styles.css');
</style>