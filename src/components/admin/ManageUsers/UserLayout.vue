<!-- layout for displaying users in manageAccounts.html -->
<template>
    <div class="user-layout-container layout-container" :class="{ 'header': showHeader }" :id="userId">
        <div>
            <span class="hide-overflow-text flex-15" :title="displayUserId">{{ displayUserId }}</span>
            <span class="hide-overflow-text flex-15" :title="displayUsername">{{ displayUsername }}</span>
            <span class="hide-overflow-text flex-10" :title="displayIsAdmin">{{ displayIsAdmin }}</span>
            <span class="hide-overflow-text flex-10" :title="displayStatus">{{ displayStatus }}</span>
            <span class="hide-overflow-text flex-15" v-if="viewSuspended" :title="displayEndTime">{{ displayEndTime }}</span>
            <span class="hide-overflow-text flex-15" v-if="viewSuspended || viewTerminated" :title="displayPerformedBy">{{ displayPerformedBy }}</span>
            <span class="hide-overflow-text flex-10" :title="displayWarnings">{{ displayWarnings }}</span>
        </div>

        <button class="use-primary-secondary-gradient details-button" title="View user details"
            @click="showUserDetails">Details</button>
    </div>
</template>

<script>
import getFormattedTime from '../../../utils/general/getFormattedTime.js';

export default {
    props: [
        'showHeader',
        'viewSuspended',
        'viewTerminated',
        'user'
    ],
    emits: [
        'view-user-details'
    ],
    methods: {
        // to view user details
        showUserDetails() {
            this.$emit('view-user-details');
        }
    },
    computed: {
        displayUserId() {
            return this.showHeader ? 'User ID' : this.user._id;
        },
        displayUsername() {
            return this.showHeader ? 'Username' : this.user.username;
        },
        displayIsAdmin() {
            return this.showHeader ? 'Admin' : this.user.is_admin;
        },
        displayStatus() {
            return this.showHeader ? 'Status' : (
                this.user.status?.status ? this.user.status.status : 'NA'
            );
        },
        displayEndTime() {
            return this.showHeader ? 'Suspend Till' : getFormattedTime(this.user.status?.end_time);
        },
        displayPerformedBy() {
            return this.showHeader ? `${ this.viewSuspended ? 'Suspended' : 'Terminated' } By:` : this.user.status?.performed_by.username;
        },
        displayWarnings() {
            return this.showHeader ? 'Warnings' : this.user.warnings.length;
        }
    }
}
</script>

<style>
.user-layout-container {
    .user-layout-userid {
        flex: 0 0 20%;
    }

    .user-layout-username {
        flex: 0 0 15%;
    }

    .user-layout-warnings {
        flex: 0 0 10%;
    }
}
</style>