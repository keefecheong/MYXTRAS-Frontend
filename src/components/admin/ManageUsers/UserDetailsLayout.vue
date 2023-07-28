<!-- layout for complete user details -->

<template>
    <LoadingOverlay v-if="showLoading" :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" />

    <div class="detailed-layout-container">
        <div class="detailed-layout-side-container close">
            <span class="material-symbols-outlined" id="close-user-details-button" title="Back" @click="closeDetailedView">arrow_back</span>
        </div>
        
        <div class="detailed-layout-content-container">
            <h1>User Details</h1>

            <div>
                <div>
                    <span>User ID:</span>
                    <span>{{ user._id }}</span>
                </div>

                <div>
                    <span>Username:</span>
                    <span>{{ user.username }}</span>
                </div>

                <div>
                    <span>Real Name:</span>
                    <span>{{ user.real_name }}</span>
                </div>

                <div>
                    <span>Role:</span>
                    <span>{{ user.is_admin ? 'Admin' : 'User' }}</span>
                </div>

                <div>
                    <span>Profile Setup:</span>
                    <span>{{ user.is_profile_setup ? 'True' : 'False' }}</span>
                </div>
            </div>

            <div>
                <div>
                    <span>School:</span>
                    <span>{{ user.school }}</span>
                </div>

                <div>
                    <span>Course:</span>
                    <span>{{ user.course }}</span>
                </div>

                <div>
                    <span>Biography:</span>
                    <span>{{ user.biography || 'Empty' }}</span>
                </div>
    
                <div>
                    <span>Interests:</span>
                    <InterestBadgeList v-if="user.interests.length > 0" :selectedOption="user.interests" :selection="false" />
                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Followers:</span>
                    
                    <ul v-if="user.followers.length > 0">
                        <li v-for="follower in user.followers" class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(follower)">{{ follower }}</li>
                    </ul>

                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Blocked Users:</span>
                    
                    <ul v-if="user.blocked_users.length > 0">
                        <li v-for="entry in user.blocked_users" class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(entry.user_id)">{{ entry.user_id }}</li>
                    </ul>

                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Status:</span>
                    <span>{{ user.status?.status || 'None' }}</span>
                </div>

                <div v-if="user.status?.status == 'Suspended'">
                    <span>Suspend End Time:</span>
                    <span>{{ getTimeToDisplay(user.status.end_time) }}</span>
                </div>

                <div v-if="user.status?.status">
                    <span>Admin Username:</span>
                    <span>{{ user.status.performed_by.username }}</span>
                </div>

                <div v-if="user.status?.status">
                    <span>Admin ID:</span>
                    <span class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(user.status.performed_by._id)">{{ user.status.performed_by._id }}</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Warnings:</span>

                    <ul v-if="user.warnings.length > 0" id="user-details-warnings-container">
                        <li class="user-details-warning" v-for="warning in user.warnings">
                            <div>
                                <span>Object ID:</span>
                                <span>{{ warning.object_id }}</span>
                            </div>

                            <div>
                                <span>Object Type:</span>
                                <span>{{ warning.object_type }}</span>
                            </div>

                            <div>
                                <span>Violation:</span>
                                <span>{{ warning.reason }}</span>
                            </div>

                            <div>
                                <span>Reviewer Username:</span>
                                <span>{{ warning.reviewer_id.username }}</span>
                            </div>

                            <div>
                                <span>Reviewer ID:</span>
                                <span class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(warning.reviewer_id._id)">{{ warning.reviewer_id._id }}</span>
                            </div>

                            <div>
                                <span>Reviewed At:</span>
                                <span>{{ getTimeToDisplay(warning.review_time) }}</span>
                            </div>
                        </li>
                    </ul>
                    
                    <span v-else>None</span>
                </div>
            </div>

            <button class="use-primary-secondary-gradient details-button detailed-layout-view-button" title="View User" @click="viewUser(user._id)">View User</button>
        </div>

        <div class="detailed-layout-side-container right">
            <button v-if="!user.status?.status || user.is_admin" class="use-primary-secondary-gradient details-button" :title="`${action} User`" @click="changeUserRole">{{ action }}</button>
        </div>
    </div>
</template>

<script>
import LoadingOverlay from '../../general/LoadingOverlay.vue';
import InterestBadgeList from '../../general/InterestBadgeList.vue';

import getFormattedTime from '../../../utils/general/getFormattedTime.js';
import viewUser from '../../../utils/general/viewUser.js';

import { useAlertStore } from '../../../stores/AlertStore.js';
import { useConfirmStore } from '../../../stores/ConfirmStore.js';

export default {
    components: {
        LoadingOverlay,
        InterestBadgeList
    },
    props: [
        'user'
    ],
    emits: [
        'close-user-details'
    ],
    computed: {
        // get name of action to perform (promote/demote)
        action() {
            return this.user.is_admin ? 'Demote' : 'Promote';
        }
    },
    methods: {
        // to close detailed user view
        closeDetailedView() {
            this.$emit('close-user-details');
        },
        // to get formatted time
        getTimeToDisplay(timeString) {
            return getFormattedTime(timeString);
        },
        // to view user profile
        viewUser(userId) {
            viewUser(userId, true);
        },
        // promote/demote user/admin
        async changeUserRole() {
            // do nothing if user is suspended or terminated and user is not admin
            if (this.user.status?.status && !this.user.is_admin) {
                return;
            }

            const confirmAction = await useConfirmStore().confirm(`Are you sure you want to ${this.action} this user?`);

            if (!confirmAction) {
                return;
            }

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/admin/manage/${this.user._id}`, {
                method: this.user.is_admin ? 'DELETE' : 'POST',
                mode: 'cors',
                credentials: 'include'
            }).then(async res => {
                await res.json().then(async data => {
                    await useAlertStore().alert(data.message);

                    if (res.ok) {
                        this.user.is_admin = !this.user.is_admin;
                        this.closeDetailedView();
                    }
                });
            }).catch(error => console.log(`Could not ${action} user.`));
        }
    }
}
</script>

<style>
#user-details-warnings-container {
    width: 100%;
    list-style-type: none;
}

.user-details-warning {
    padding: 10px;
    border-bottom: 1px solid lightgray;

    > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 30px;

        > *:first-child {
            flex: 0 0 50%;
        }
    }
}
</style>