<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        
        <div id="main-content">
            <div class="create-event" @click="createEvent()" @mouseover="expandBtn(true)" @mouseleave="expandBtn(false)">
                <div class="minimized-btn" id="expanded-btn">
                    Create Event
                </div>
                <div class="plus-btn">
                    +
                </div>
            </div>
            <h1 class="row pink-header">Xtra EVENTS! 🔊</h1>
            <AnnoucementLayout/>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
import AnnoucementLayout from '../../../components/announcement/AnnoucementLayout.vue';

export default {
    components: {
        NavSidebar,
        AnnoucementLayout
    },
    data() {
        return {
            hover: false
        }
    },
    methods: {
        createEvent() {
            console.log("Create event")
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

.pink-header {
    margin: 0 -12px 0 -12px;
    padding-top: 3vh;
    padding-bottom: 3vh;
    background-color: var(--primary);
    color: white;
    justify-content: center;
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
    right: 2.9%;
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
    right: 2.9%;
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
    right: 2.9%;
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