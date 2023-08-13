<!-- layout for complete user details -->

<template>
    <LoadingOverlay
        v-if="showLoading"
        :backgroundColor="'rgba(0, 0, 0, 0.5)'"
        :center="true"
    />

    <div class="detailed-layout-container">
        <div class="detailed-layout-side-container close">
            <span
                class="material-symbols-outlined"
                id="close-user-details-button"
                title="Back"
                @click="closeDetailedView"
                >arrow_back</span
            >
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
                    <span>{{ user.is_admin ? "Admin" : "User" }}</span>
                </div>

                <div>
                    <span>Profile Setup:</span>
                    <span>{{ user.is_profile_setup ? "True" : "False" }}</span>
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
                    <span>{{ user.biography || "Empty" }}</span>
                </div>

                <div>
                    <span>Interests:</span>
                    <InterestBadgeList
                        v-if="user.interests.length > 0"
                        :selectedOption="user.interests"
                        :selection="false"
                    />
                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Followers:</span>

                    <ul v-if="user.followers.length > 0">
                        <li
                            v-for="follower in user.followers"
                            class="details-layout-profile-link"
                            title="Click to view user"
                            @click="() => viewUser(follower)"
                        >
                            {{ follower }}
                        </li>
                    </ul>

                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Blocked Users:</span>

                    <ul v-if="user.blocked_users.length > 0">
                        <li
                            v-for="entry in user.blocked_users"
                            class="details-layout-profile-link"
                            title="Click to view user"
                            @click="() => viewUser(entry.user_id)"
                        >
                            {{ entry.user_id }}
                        </li>
                    </ul>

                    <span v-else>None</span>
                </div>
            </div>

            <div>
                <div>
                    <span>Status:</span>
                    <span>{{ user.status?.status || "Active" }}</span>
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
                    <span
                        class="details-layout-profile-link"
                        title="Click to view user"
                        @click="() => viewUser(user.status.performed_by._id)"
                        >{{ user.status.performed_by._id }}</span
                    >
                </div>
            </div>

            <div>
                <div>
                    <span>Warnings:</span>

                    <div
                        v-if="user.warnings.length > 0"
                        id="user-details-warnings-container"
                    >
                        <WarningLayout
                            v-for="warning in user.warnings"
                            :warning="warning"
                            :admin="true"
                        />
                    </div>

                    <span v-else>None</span>
                </div>
            </div>

            <button
                class="use-primary-secondary-gradient details-button detailed-layout-view-button"
                title="View User"
                @click="viewUser(user._id)"
            >
                View User
            </button>
        </div>

        <div class="detailed-layout-side-container right">
            <!-- only show actions if not viewing self -->
            <div v-if="!user.isSelf">
                <!-- to promote/demote user -->
                <button
                    v-if="showPromote.show"
                    class="promote-btn"
                    :title="`${showPromote.title} User`"
                    @click="() => performAction(showPromote)"
                >
                    {{ showPromote.title }}
                </button>

                <!-- to suspend/unsuspend user -->
                <button
                    v-if="showSuspend.show"
                    class="suspend-btn"
                    :title="`${showSuspend.title} User`"
                    @click="
                        () => {
                            showSuspend.suspended
                                ? performAction(showSuspend)
                                : toggleSuspendForm(true);
                        }
                    "
                >
                    {{ showSuspend.title }}
                </button>

                <!-- to terminate/unterminate user -->
                <button
                    class="terminate-btn"
                    :title="`${showTerminate.title} User`"
                    @click="() => performAction(showTerminate)"
                >
                    {{ showTerminate.title }}
                </button>
            </div>
        </div>
    </div>

    <div class="form-overlay" v-if="showSuspendForm">
        <form
            class="form-overlay-content"
            id="suspend-form"
            @submit.prevent="performAction(showSuspend)"
        >
            <button
                class="form-overlay-close"
                @click="() => toggleSuspendForm(false)"
                type="button"
            >
                <span class="material-symbols-outlined">Close</span>
            </button>

            <h1>Suspend User</h1>

            <div id="suspend-duration-container">
                <label id="suspend-duration-label" for="suspend-duration">
                    <span>Suspend user for:</span>
                    <input
                        type="number"
                        id="suspend-duration"
                        min="0"
                        step="1"
                        v-model="suspendDuration"
                    />
                    <span>(minutes)</span>
                </label>
            </div>

            <button
                class="form-overlay-control-button"
                :disabled="suspendDuration <= 0"
            >
                Suspend
            </button>
        </form>
    </div>
</template>

<script>
import LoadingOverlay from "../../general/LoadingOverlay.vue";
import InterestBadgeList from "../../general/InterestBadgeList.vue";
import WarningLayout from "./WarningLayout.vue";

import getFormattedTime from "../../../utils/general/getFormattedTime.js";
import viewUser from "../../../utils/general/viewUser.js";

import { useAlertStore } from "../../../stores/AlertStore.js";
import { useConfirmStore } from "../../../stores/ConfirmStore.js";

export default {
    data() {
        return {
            showLoading: false,
            showSuspendForm: false,
            suspendDuration: 0,

            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm,
        };
    },
    components: {
        LoadingOverlay,
        InterestBadgeList,
        WarningLayout,
    },
    props: ["user"],
    emits: ["close-user-details"],
    computed: {
        // get title of button to promote/demote user and show promote/demote button if the user is an admin or the user is not terminated nor suspended
        showPromote() {
            return {
                title: this.user.is_admin ? "Demote" : "Promote",
                show: this.user.is_admin || !this.user.status?.status,
                method: this.user.is_admin ? "DELETE" : "POST",
                url: `/admin/${this.user._id}`,
            };
        },
        // get title of button to terminate/unterminate user
        showTerminate() {
            const check = this.user.status?.status == "Terminated";

            return {
                title: check ? "Unterminate" : "Terminate",
                show: true,
                method: check ? "DELETE" : "POST",
                url: `/terminate/${this.user._id}`,
            };
        },
        // get title of button to suspend/unsuspend user and show suspend button if user is not terminated
        showSuspend() {
            const check = this.user.status?.status == "Suspended";

            return {
                suspended: check,
                title: check ? "Unsuspend" : "Suspend",
                show: this.user.status?.status != "Terminated",
                method: check ? "DELETE" : "POST",
                url: `/suspend/${this.user._id}`,
            };
        },
    },
    methods: {
        // to close detailed user view
        closeDetailedView() {
            this.$emit("close-user-details");
        },
        // to get formatted time
        getTimeToDisplay(timeString) {
            return getFormattedTime(timeString);
        },
        // to view user profile
        viewUser(userId) {
            viewUser(userId, true);
        },
        // perform actions on user status/role
        async performAction(action) {
            // do nothing if trying to perform actions on self
            if (this.user.isSelf) {
                await this.alert(`Cannot ${action} yourself.`);

                return;
            }

            // do nothing if button should not be shown
            if (!action.show) {
                await this.alert(`Unable to ${action.title} user.`);

                return;
            }

            const confirmAction = await this.confirm(
                `Are you sure you want to ${action.title} this user?`,
            );

            if (!confirmAction) {
                return;
            }

            const tempDuration = this.suspendDuration;

            this.toggleSuspendForm(false);

            this.showLoading = true;

            const options = {
                method: action.method,
                mode: "cors",
                credentials: "include",
            };

            if (action.title == "Suspend") {
                options.body = JSON.stringify({
                    duration: tempDuration * 60 * 1000,
                });

                options.headers = {
                    "Content-Type": "application/json",
                };
            }

            await fetch(
                `${import.meta.env.VITE_APP_SERVER_URL}/api/admin/accounts${
                    action.url
                }`,
                options,
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        await this.alert(data.message);

                        if (res.ok) {
                            location.reload();
                        }
                    });
                })
                .catch((error) =>
                    console.log(`Could not ${action.title} user.`),
                );

            this.showLoading = false;
        },
        // to toggle form to input suspend duration
        toggleSuspendForm(show) {
            this.showSuspendForm = show;

            if (!show) {
                this.suspendDuration = 0;
            }
        },
    },
};
</script>

<style>
@import url("../../../styles/forms/form-overlay-styles.css");

#user-details-warnings-container {
    width: 100%;

    .detailed-layout-content-container > div {
        width: 80%;
    }
}

#suspend-duration-label {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
}

.promote-btn {
    background-color: var(--green);
    border: 2px solid var(--green);
    color: white;
    padding-left: 20px;
    padding-right: 20px;
}

.promote-btn:hover {
    background-color: white;
    color: black;
}

.suspend-btn {
    background-color: orange;
    border: 2px solid orange;
    color: white;
}

.suspend-btn:hover {
    background-color: white;
    color: black;
}

.terminate-btn {
    background-color: var(--red);
    border: 2px solid var(--red);
    color: white;
}

.terminate-btn:hover {
    background-color: white;
    color: black;
}
</style>
