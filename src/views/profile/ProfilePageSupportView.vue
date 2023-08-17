<!-- layout for viewing warnings/reports on profile page -->

<template>
    <div id="profile-page-support-header-container">
        <AdminBanner>
            <template v-slot:header>
                <h1>Support</h1>
            </template>

            <template v-slot:right-content>
                <div class="banner-toggle-container">
                    <button
                        class="use-primary-secondary-gradient details-button hover-contrast"
                        :class="{ active: viewWarnings }"
                        title="View warnings"
                        @click="() => toggleWarnings(true)"
                    >
                        Warnings
                    </button>
                    <button
                        class="use-primary-secondary-gradient details-button hover-contrast"
                        :class="{ active: !viewWarnings }"
                        title="View submitted reports"
                        @click="() => toggleWarnings(false)"
                    >
                        Submitted Reports
                    </button>
                </div>
            </template>
        </AdminBanner>

        <!-- link to go back to profile page -->
        <router-link to="/" id="profile-page-support-back">
            <span class="material-symbols-outlined">arrow_back</span>
        </router-link>
    </div>

    <div v-if="viewWarnings">
        <h1 class="profile-support-page-header">Warnings</h1>

        <div v-if="user.warnings.length > 0">
            <WarningLayout
                v-for="warning in user.warnings"
                :warning="warning"
            />
        </div>

        <div v-else>
            <p class="no-items">
                You have not violated any of our guidelines. Keep it up!
            </p>
        </div>
    </div>

    <div v-else>
        <div v-if="reportsLoaded && reports.length > 0">
            <div v-if="!viewDetails">
                <h1 class="profile-support-page-header" v-if="pendingReports.length > 0">Pending</h1>
                <ReportLayout
                    v-for="(report, index) in pendingReports"
                    :report="report"
                    :fromProfile="true"
                    :index="index"
                    :key="report._id"
                    @view-report-details="
                        () => toggleReportDetails(true, false, index)
                    "
                />

                <h1 class="profile-support-page-header" v-if="reviewedReports.length > 0">Reviewed</h1>
                <ReportLayout
                    v-for="(report, index) in reviewedReports"
                    :report="report"
                    :fromProfile="true"
                    :index="index"
                    :key="report._id"
                    @view-report-details="
                        () => toggleReportDetails(true, true, index)
                    "
                />
            </div>

            <div v-else>
                <ReportDetailsLayout
                    :report="
                        fromReviewed
                            ? reviewedReports[viewDetailsIndex]
                            : pendingReports[viewDetailsIndex]
                    "
                    @close-report-details="() => toggleReportDetails(false)"
                />
            </div>
        </div>

        <div v-else>
            <p class="no-items">You have not submitted any reports.</p>
        </div>
    </div>
</template>

<script>
import AdminBanner from "../../components/admin/AdminBanner.vue";
import WarningLayout from "../../components/admin/ManageUsers/WarningLayout.vue";
import ReportLayout from "../../components/admin/Reports/ReportLayout.vue";
import ReportDetailsLayout from "../../components/admin/Reports/ReportDetailsLayout.vue";

export default {
    data() {
        return {
            viewWarnings: true,
            reportsLoaded: false,
            reports: [],
            viewDetails: false,
            viewDetailsIndex: null,
            fromReviewed: null,
        };
    },
    components: {
        AdminBanner,
        WarningLayout,
        ReportLayout,
        ReportDetailsLayout,
    },
    props: ["userData"],
    emits: ["start-loading", "stop-loading"],
    computed: {
        user() {
            return this.userData.user;
        },
        reviewedReports() {
            return this.reports.filter(
                (report) => report.status != "Submitted",
            );
        },
        pendingReports() {
            return this.reports.filter(
                (report) => report.status == "Submitted",
            );
        },
    },
    methods: {
        // to toggle loading wheel on profile page
        toggleChildLoading(loading) {
            loading ? this.$emit("start-loading") : this.$emit("stop-loading");
        },
        // to toggle between warnings and reports
        async toggleWarnings(show) {
            if (!show && !this.reportsLoaded) {
                await this.getReports();
            }

            this.viewDetailedReport = false;
            this.viewWarnings = show;
        },
        // to view/hide report details
        toggleReportDetails(show, fromReviewed, index) {
            this.viewDetails = show;
            this.fromReviewed = fromReviewed;
            this.viewDetailsIndex = index;
        },
        // to fetch submitted reports
        async getReports() {
            console.log("getting reports");
            this.toggleChildLoading(true);

            await fetch(
                `${
                    process.env.APP_SERVER_URL
                }/api/report/user/submitted`,
                {
                    mode: "GET",
                    credentials: "include",
                    mode: "cors",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.reports = data;
                        this.reportsLoaded = true;
                    });
                })
                .catch((error) => console.log("Could not retrieve reports."));

            this.toggleChildLoading(false);
        },
    },
};
</script>

<style>
@import url("../../styles/admin/common-admin-entry-styles.css");

#profile-page-support-header-container {
    position: sticky;
    top: 0;
}

#profile-page-support-back {
    position: absolute;
    top: 25px;
    left: 25px;
    z-index: var(--above-banner-z-index);

    .material-symbols-outlined {
        font-size: 2rem;
    }
}

.profile-support-page-header {
    margin: 10px 0;
    text-decoration: underline;
    text-decoration-thickness: 2px;
}
</style>
