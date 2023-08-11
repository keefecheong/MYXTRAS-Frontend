<template>
    <LoadingOverlay v-if="showLoading" :center="true" :backgroundColor="'rgba(0, 0, 0, 0.5)'" />
    
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
                    <h1>Xtra EVENTS! 🔊</h1>
                </template>
            </AdminBanner>

            <AnnoucementLayout @edit-event="handleEditEvent" @show-loading="(show) => toggleLoading(show)"/>

            <div class="create-event" @click="togglePopup(true)" @mouseover="expandBtn(true)" @mouseleave="expandBtn(false)">
                <div class="minimized-btn" id="expanded-btn">
                    Create Event
                </div>
                <div class="plus-btn">
                    +
                </div>
            </div>

            <EventsFormLayout v-if="showForm" @close-event-form="() => { togglePopup(false) }" :event="eventToEdit"/>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
import AnnoucementLayout from '../../../components/announcement/AnnoucementLayout.vue';
import EventsFormLayout from '../../../components/admin/Events/EventsFormLayout.vue';
import { useAlertStore } from '../../../stores/AlertStore.js';
import AlertPrompt from '../../../components/general/AlertPrompt.vue';
import { useConfirmStore } from '../../../stores/ConfirmStore.js';
import ConfirmPrompt from '../../../components/general/ConfirmPrompt.vue';
import LoadingOverlay from '../../../components/general/LoadingOverlay.vue';
import AdminBanner from '../../../components/admin/AdminBanner.vue';

export default {
    components: {
        NavSidebar,
        AnnoucementLayout,
        EventsFormLayout,
        AlertPrompt,
        ConfirmPrompt,
        LoadingOverlay,
        AdminBanner
    },
    data() {
        return {
            hover: false,
            showForm: false,
            alertStore: useAlertStore(),
            confirmStore: useConfirmStore(),
            showLoading: false,
            eventToEdit: null
        }
    },
    methods: {
        // to toggle loading wheel
        toggleLoading(show) {
            this.showLoading = show;
        },
        // to toggle event form
        togglePopup(showForm) {
            this.showForm = showForm;

            if (!showForm) {
                this.eventToEdit = null;
            }
        },
        expandBtn(bool) {
            if (bool) {
                document.getElementById("expanded-btn").className = "expanded-btn";
            } else {
                document.getElementById("expanded-btn").className = "minimized-btn";
            }
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
        // to close confirm prompt
        closeConfirm(decision){
            this.confirmStore.closeConfirm(decision);
        },
        // to handle edit event
        handleEditEvent(event) {
            this.eventToEdit = event;
            this.togglePopup(true);
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
    },
}
</script>

<style>
@import url('../../../styles/main.css');

.create-event {
    cursor: pointer;
}

.plus-btn {
    position: fixed;
    background-color: var(--primary);
    border-radius: 50%;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    bottom: 6%;
    right: 2.7%;
    font-size: 24px;
    z-index: 2;
}

.expanded-btn {
    position: fixed;
    background-color: #f73978;
    border-radius: 100px;
    width: 180px;
    height: 55px;
    display: flex;
    align-items: center;
    color: white;
    bottom: 6%;
    right: 2.7%;
    font-size: 15px;
    padding-left: 25px;
    z-index: 1;
    animation: expand 1s;
}

@keyframes expand {
    from {
        width: 50px;
    }
    to {
        width: 180px;
    }
}

.minimized-btn {
    position: fixed;
    background-color: #f73978;
    border-radius: 100px;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    color: white;
    bottom: 6%;
    right: 2.7%;
    font-size: 15px;
    padding-left: 25px;
    z-index: 1;
    animation: minimize 1s;
}

@keyframes minimize {
    from {
        width: 180px;
    }
    to {
        width: 50px;
    }
}


</style>