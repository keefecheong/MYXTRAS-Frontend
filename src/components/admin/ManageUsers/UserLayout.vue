<!-- layout for displaying users in manageAccounts.html -->
<template>
    <div class="parent-layout-container">
        <div
            v-for="i in ['header', 'value']"
            class="layout-container"
            :class="{ header: i == 'header', 'display-header': index == 0 }"
        >
            <div>
                <span
                    class="hide-overflow-text flex-15"
                    :title="displayUserId[i]"
                    >{{ displayUserId[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-15"
                    :title="displayUsername[i]"
                    >{{ displayUsername[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-10"
                    :title="displayIsAdmin[i]"
                    >{{ displayIsAdmin[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-10"
                    :title="displayStatus[i]"
                    >{{ displayStatus[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-15"
                    v-if="viewSuspended"
                    :title="displayEndTime[i]"
                    >{{ displayEndTime[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-15"
                    v-if="viewSuspended || viewTerminated"
                    :title="displayPerformedBy[i]"
                    >{{ displayPerformedBy[i] }}</span
                >

                <span
                    class="hide-overflow-text flex-10"
                    :title="displayWarnings[i]"
                    >{{ displayWarnings[i] }}</span
                >
            </div>

            <button
                class="use-primary-secondary-gradient details-button"
                title="View user details"
                @click="showUserDetails"
            >
                Details
            </button>
        </div>
    </div>
</template>

<script>
import getFormattedTime from "../../../utils/general/getFormattedTime.js";

export default {
    props: ["viewSuspended", "viewTerminated", "user", "index"],
    emits: ["view-user-details"],
    methods: {
        // to view user details
        showUserDetails() {
            this.$emit("view-user-details");
        },
    },
    computed: {
        displayUserId() {
            return {
                header: "User ID",
                value: this.user._id,
            };
        },
        displayUsername() {
            return {
                header: "Username",
                value: this.user.username,
            };
        },
        displayIsAdmin() {
            return {
                header: "Admin",
                value: this.user.is_admin,
            };
        },
        displayStatus() {
            return {
                header: "Status",
                value: this.user.status?.status
                    ? this.user.status.status
                    : "Active",
            };
        },
        displayEndTime() {
            return {
                header: "Suspend Till",
                value: getFormattedTime(this.user.status?.end_time),
            };
        },
        displayPerformedBy() {
            return {
                header: `${
                    this.viewSuspended ? "Suspended" : "Terminated"
                } By:`,
                value: this.user.status?.performed_by.username,
            };
        },
        displayWarnings() {
            return {
                header: "Warnings",
                value: this.user.warnings.length,
            };
        },
    },
};
</script>
