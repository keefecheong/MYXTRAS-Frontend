<template>
    <AlertPrompt
        v-if="showAlert && alertMsg.length > 0"
        @close-alert="closeAlert"
    >
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt
        v-if="showConfirm && confirmMsg.length > 0"
        @close-confirm="closeConfirm"
    >
        {{ confirmMsg }}
    </ConfirmPrompt>

    <div id="main-container">
        <NavSidebar :forAdmin="true" />

        <div id="main-content">
            <AdminBanner>
                <template v-slot:header>
                    <h1>Manage Accounts</h1>
                </template>

                <template v-slot:right-content>
                    <div class="banner-toggle-container">
                        <button
                            class="use-primary-secondary-gradient details-button hover-contrast"
                            :class="{ active: viewUsers }"
                            title="View users"
                            @click="() => toggleViewUsers(1)"
                        >
                            Users
                        </button>
                        <button
                            class="use-primary-secondary-gradient details-button hover-contrast"
                            :class="{ active: viewAdmins }"
                            title="View admins"
                            @click="() => toggleViewUsers(2)"
                        >
                            Admins
                        </button>
                        <button
                            class="use-primary-secondary-gradient details-button hover-contrast"
                            :class="{ active: viewSuspended }"
                            title="View suspended accounts"
                            @click="() => toggleViewUsers(3)"
                        >
                            Suspended
                        </button>
                        <button
                            class="use-primary-secondary-gradient details-button hover-contrast"
                            :class="{ active: viewTerminated }"
                            title="View terminated accounts"
                            @click="() => toggleViewUsers(4)"
                        >
                            Terminated
                        </button>
                    </div>
                </template>
            </AdminBanner>

            <div v-if="usersToDisplay.length > 0">
                <div v-if="!viewDetailed">
                    <UserLayout
                        v-for="(user, index) in usersToDisplay"
                        :user="user"
                        :viewSuspended="viewSuspended"
                        :viewTerminated="viewTerminated"
                        :index="index"
                        :key="user._id"
                        @view-user-details="
                            () => toggleUserDetails(true, index)
                        "
                    />
                </div>

                <div v-else>
                    <UserDetailsLayout
                        :user="usersToDisplay[selectedIndex]"
                        @close-user-details="() => toggleUserDetails(false)"
                    />
                </div>
            </div>

            <div v-else>
                <p class="no-items">No users found.</p>
            </div>
        </div>
    </div>
</template>

<script>
import NavSidebar from "../../../components/general/NavSidebar.vue";
import AdminBanner from "../../../components/admin/AdminBanner.vue";
import UserLayout from "../../../components/admin/ManageUsers/UserLayout.vue";
import UserDetailsLayout from "../../../components/admin/ManageUsers/UserDetailsLayout.vue";
import AlertPrompt from "../../../components/general/AlertPrompt.vue";
import ConfirmPrompt from "../../../components/general/ConfirmPrompt.vue";
import { useAlertStore } from "../../../stores/AlertStore.js";
import { useConfirmStore } from "../../../stores/ConfirmStore.js";

export default {
    components: {
        NavSidebar,
        AdminBanner,
        UserLayout,
        UserDetailsLayout,
        AlertPrompt,
        ConfirmPrompt,
    },
    data() {
        return {
            profilePicture:
                "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
            users: [],
            viewDetailed: false,
            selectedIndex: null,

            viewUsers: true,
            viewAdmins: false,
            viewSuspended: false,
            viewTerminated: false,

            alertStore: useAlertStore(),
            confirmStore: useConfirmStore(),
        };
    },
    created() {
        this.getUsers();
    },
    methods: {
        // to get user data
        async getUsers() {
            await fetch(
                `${
                    process.env.APP_SERVER_URL
                }/api/admin/accounts/admin`,
                {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then((data) => {
                        this.users = data;
                    });
                })
                .catch((error) => console.log("Could not retrieve users."));
        },
        // to toggle between user list and user details
        toggleUserDetails(show, index) {
            this.viewDetailed = show;
            this.selectedIndex = index;
        },
        // to toggle between the group of users to view
        toggleViewUsers(value) {
            this.toggleUserDetails(false);
            this.viewUsers = value == 1;
            this.viewAdmins = value == 2;
            this.viewSuspended = value == 3;
            this.viewTerminated = value == 4;
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // to close confirm prompt
        closeConfirm(decision) {
            this.confirmStore.closeConfirm(decision);
        },
    },
    computed: {
        // filter users list to get suspended accounts
        suspendedAccounts() {
            return this.users.filter(
                (user) => user.status?.status == "Suspended",
            );
        },
        // filter users list to get terminated accounts
        terminatedAccounts() {
            return this.users.filter(
                (user) => user.status?.status == "Terminated",
            );
        },
        // filter users list to get user accounts
        userAccounts() {
            return this.users.filter((user) => !user.is_admin);
        },
        // filter users list to get admin accounts
        adminAccounts() {
            return this.users.filter((user) => user.is_admin);
        },
        // to get list of users to display
        usersToDisplay() {
            if (this.viewSuspended) {
                return this.suspendedAccounts;
            } else if (this.viewTerminated) {
                return this.terminatedAccounts;
            } else if (this.viewAdmins) {
                return this.adminAccounts;
            } else {
                return this.userAccounts;
            }
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
        },
    },
};
</script>

<style>
@import url("../../../styles/main.css");
@import url("../../../styles/admin/common-admin-entry-styles.css");
</style>
