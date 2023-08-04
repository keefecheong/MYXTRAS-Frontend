<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        
        <div id="main-content">
            <div id="header">
                <h1 id="title">Xtra EVENTS! 🔊</h1>
            </div>
            <AnnoucementLayout/>
            <div class="create-event" @click="togglePopup(true)" @mouseover="expandBtn(true)" @mouseleave="expandBtn(false)">
                <div class="minimized-btn" id="expanded-btn">
                    Create Event
                </div>
                <div class="plus-btn">
                    +
                </div>
            </div>
            <EventsFormLayout v-if="showForm" @close-event-form="() => { togglePopup(false) }"/>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
import AnnoucementLayout from '../../../components/announcement/AnnoucementLayout.vue';
import EventsFormLayout from '../../../components/admin/Events/EventsFormLayout.vue';

export default {
    components: {
        NavSidebar,
        AnnoucementLayout,
        EventsFormLayout
    },
    data() {
        return {
            hover: false,
            showForm: false
        }
    },
    methods: {
        togglePopup(showForm) {
            this.showForm = showForm;
        },
        expandBtn(bool) {
            if (bool) {
                document.getElementById("expanded-btn").className = "expanded-btn";
            } else {
                document.getElementById("expanded-btn").className = "minimized-btn";
            }
        }
    }
}
</script>

<style>
@import url('../../../styles/main.css');

#header{
    display: flex;
    flex-direction: row;
    background-color: #133B5B;
    padding: 30px 0 30px 0;
    min-height: 17vh;
    margin-left: -20px;
    justify-content: center;
}

#title{
    color: white;
    text-align: center;
    border-bottom: #EDEDED 1px solid;
    width: 45%;
}

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