<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <ConfirmPrompt v-if="showConfirm && confirmMsg.length > 0" @close-confirm="closeConfirm">
        {{ confirmMsg }}
    </ConfirmPrompt>

    <LoadingOverlay v-if="loading || childLoading" :center="true" :backgroundColor="'rgba(0, 0, 0, 0.5)'" />
    
    <div id="main-container">
        <NavSidebar />

        <div id="main-content">
            <router-view
                v-if="!loading"
                :userData="userData"
                :blogs="blogs"
                @start-loading="() => toggleChildLoading(true)"
                @stop-loading="() => toggleChildLoading(false)"
            />

            <Pets/>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';

import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useConfirmStore } from '../../stores/ConfirmStore.js';
import ConfirmPrompt from '../../components/general/ConfirmPrompt.vue';
import LoadingOverlay from '../../components/general/LoadingOverlay.vue';

export default {
    components: {
        NavSidebar,
        AlertPrompt,
        ConfirmPrompt,
        LoadingOverlay,
    },
    data() {
        return {
            loading: true,
            childLoading: false,
            targetUserId: null,
            userData: null,
            
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore()
        }
    },
    created() {
        // if page is reloaded then use the stored tempUser field as the target user
        if (window.performance.getEntriesByType('navigation').map((nav) => nav.type).includes('reload')) {
            this.targetUserId = sessionStorage.getItem('tempUser');
            sessionStorage.removeItem('tempUser');
        }
        else {
            const userId = sessionStorage.getItem('user');

            // if 'user' is present in sessionStorage then view that profile
            // otherwise default to 'self'
            this.targetUserId = userId || 'self';
        }

        // initialize data
        this.initData();
        
        window.addEventListener('beforeunload', this.handleUnload);
    },
    methods: {
        // save user id as a temp field in sessionStorage and remove current user field
        // tempUser will be used to continue viewing the current user if page refreshes
        // if user goes to another page 'user' field will be unset - prevent profile page stuck on a user
        handleUnload() {
            const currentUser = sessionStorage.getItem('user') || this.userData.user._id;
            sessionStorage.setItem('tempUser', currentUser);
            sessionStorage.removeItem('user');
        },
        // to get user profile and associated posts
        async initData() {
            // get user profile and follow status
            const userPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/${this.targetUserId}`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    this.userData = data;
                });
            }).catch(error => {
                console.log(error);
            });

            // get user's posts
            const postPromise = fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/by/${this.targetUserId}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.blogs = data;
                });
            }).catch((error) => {
                console.log(error);
            });

            await Promise.all([userPromise, postPromise]).catch(error => {
                console.log(error);
            });

            this.loading = false;
        },
        // handle child loading
        toggleChildLoading(loading) {
            this.childLoading = loading;
        }
    },
    computed: {
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
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
@import url('../../styles/forums/common-forum-styles.css');
</style>