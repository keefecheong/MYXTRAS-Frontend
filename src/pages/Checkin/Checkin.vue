<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div id="dailyLogInDiv">
                <div class="left-content">
                    <h1>Daily Log-in!</h1>
                    <p>Resets every week</p>
                    <div class="imageContainer">
                        <img src="../../assets/gemsPile.png">
                    </div>
                </div>
                <div class="right-content">
                    <div id="scroll-view" v-dragscroll>
                        <div v-for="day in 7" :key="day" class="dayBox" :id="'day' + day">
                            <div class="">
                                <h3>Day {{ day }}</h3>
                                <p class="daily-points-text" style="display: inline;">{{ rewards[day - 1] }} <span class="material-symbols-outlined symbols" style="color: aqua; ">diamond</span></p>
                            </div>
                            <br>
                            <button class="pink-btn symbols locked" v-if="day > this.day">
                                <p class="material-symbols-outlined" style="text-align: center; justify-content: center;">lock</p>
                            </button>
                            <button class="pink-btn locked" v-if="day < this.day" disabled><p>Claimed</p></button>
                            <button class="pink-btn" v-if="day == this.day " @click="checkIn" :class="{ claimed: claimed }" :disabled="claimed"><p>{{claimed ? "Claimed" : "Claim"}}</p></button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="dailyTasksDiv">
                <h1>Daily Tasks</h1>
                <div id="missionsContainer" >
                    <div id="missionContainer" v-for="mission in missions">
                        <div class="left-content">
                            <p>{{ mission.title }}</p>
                        </div>
                        <div class="right-content d-flex justify-content-end">
                            <div class="d-flex mission-container">
                                <p>{{ mission.gem_count }}</p>
                                <span class="material-symbols-outlined symbols" style="color: aqua; transform: translateY(-20%) translateX(25%) !important;">diamond</span>
                                <button class="white-btn locked" v-if=mission.locked>
                                    <p class="material-symbols-outlined" style="text-align: center; justify-content: center;">lock</p>
                                </button>
                                <btn class="white-btn" :class="{claimed : mission.claimed}" v-else="!missions.locked" @click="claimMission(mission.title)"><p>Claimed</p></btn>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="missionsContainer" >
                    <div id="missionContainer">
                        <div class="left-content">
                            <p>Complete all dailies</p>
                        </div>
                        <div class="right-content d-flex justify-content-end">
                            <div class="d-flex mission-container">
                                <p>500</p>
                                <span class="material-symbols-outlined symbols" style="color: aqua; transform: translateY(-20%) translateX(25%) !important;">diamond</span>
                                <button class="white-btn locked" v-if="allClaimed.locked">
                                    <p class="material-symbols-outlined">lock</p>
                                </button>
                                <btn class="white-btn" :class="{claimed : allClaimed.claimed}" v-else="!allClaimed.locked" @click="claimMission('allClaim')"><p>Claim</p></btn>                            
                            </div>
                        </div>
                    </div>
                </div>
                <Pets />
                <button id="bottom-right-button" @click="gachapon"><span class="material-symbols-outlined" >shopping_cart</span></button>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
body {
    color: white !important;
}

h1 {
    margin: 1em 0;
    text-align: left !important;
}
h3 {
    margin: 1em 0 !important;
}
.symbols{
    display: inline !important;
}
#dailyLogInDiv {
    display: flex;
    flex-direction: row;
    background-color: #0D283D;
    padding: 50px 80px;
    min-height: 40dvh;
}
.mission-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
#dailyTasksDiv {
    background-color: #1C1B25;
    padding: 50px 80px;
    min-height: 60dvh;
}
#scroll-view {
    overflow-x: scroll;
    display: flex;
    flex-direction: row;
    height: 100%;
    cursor: grab;
}
.left-content {
    width: 20vw;
}
.right-content {
    width: 60vw;
}
.dayBox {
    display: flex;
    flex-direction: column;
    background-color: #133B5B;
    border-radius: 5px;
    margin: 0 2vw;
    text-align: center;
    min-width: 10vw;
}
.pink-btn {
    font-weight: bold;
    background-color: var(--primary);
    color:white;
    border-radius: 5px;
    margin: 0 2vw;
    white-space: normal;
    text-align: center;
    font-size: 1vw;
    transition: all 0.3s;
    margin-bottom: 5%;
    text-decoration: none;
}
.pink-btn:hover {
    background-color: transparent;
    border: 3px solid var(--primary);
    cursor: pointer;
    color:var(--primary);
}
.pink-btn:hover > .material-symbols-outlined {
    color:var(--primary);
}
.white-btn {
    font-weight: bold;
    background-color: white;
    color:black;
    border-radius: 5px;
    margin: 0 2vw;
    white-space: normal;
    text-align: center;
    font-size: 1vw;
    color: black;
}
.white-btn > .material-symbols-outlined {
    color: black;
}
.imageContainer {
    width: 60% !important;
}
.locked, .claimed {
    opacity: 0.5;
}
#missionsContainer {
    display: flex;
    flex-wrap: wrap;
}
#missionContainer {
    display: flex;
    flex-direction: row;
    width: 30vw;
    margin: 1vw;
    margin: 5vh auto;
    padding: 2vh;
    border-radius: 10px;
    background-color: #133B5B;
}
#bottom-right-button {
    position: fixed;
    bottom: 2em;
    right: 2em;
    background-color: var(--primary);
    padding: 1em;
    border-radius: 50%;
    border: none;
    animation: neonGlow 2s ease-in-out infinite alternate;

}
@keyframes neonGlow {
  0% {
    box-shadow: 0 0 5px #d81515, 0 0 10px #ff0000, 0 0 30px #fefffb, 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
  50% {
    box-shadow: 0 0 5px #d81515, 0 0 10px #ff0000, 0 0 30px var(--primary), 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
  100% {
    box-shadow: 0 0 5px #d81515, 0 0 10px var(--primary), 0 0 30px var(--primary), 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
}

/* Responsive styles */
@media screen and (max-width: 768px) {
body {
    font-size: 14px !important;
}
#main-content {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
}
.dayBox {
    width: 10vw !important;
}
h1 {
    width: 100%;
    text-align: center !important;
}
#dailyLogInDiv {
    display: flex;
    flex-direction: column;
}

.left-content,
.right-content {
    width: 100%;
    text-align: center;
}
.imageContainer {
    margin: auto;
}
#scroll-view {
    overflow-x: auto;
    width: 100%;
}
.dayBox {
    margin: 10px;
    min-width: 40vw;
}
#missionContainer {
    width: 100%;
}
#dailyLogInDiv,
#dailyTasksDiv {
    padding: 20px;
}

}

</style>

<script>

export default {
    data() {
        return {
            missions: null,
            rewards: [50, 100, 100, 100, 150, 200, 500],
            day: null,
            claimed: false,
            allClaimed: {'claimed': false, 'locked': true},
        }
    },
    created(){
        this.initData();
    },
    methods: {
        async initData(){
            // get user profile and follow status
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/missions`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    // save user data
                    this.missions = data.daily_missions;
                    this.allClaimed = data.allClaimed;
                    this.checkAllClaimed();
                });
            }).catch(error => {
                console.log(error);
            });
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/daily-checkin`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.day = data.checkin_count;
                    this.claimed = data.claimed;
                });
            }).catch((error) => {
                console.log(error);
            });
            
        },
        async checkIn(){
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/daily-checkin`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include',
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.claimed = true;    
                });
            }).catch((error) => {
                console.log(error);
            });
        },

        async claimMission(targetTitle){
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/missions/${targetTitle}`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include',
            }).then(async (res) => {
                await res.json().then((data) => {
                    if (targetTitle == 'allClaim'){
                        this.allClaimed.claimed = true;
                    }
                    else{
                        const targetMission = this.missions.find(mission => mission.title === targetTitle);
                        if (targetMission) {
                            // Update the claimed property to true
                            targetMission.claimed = true;
                        }
                    }
                    
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        gachapon(){
            window.location.href = "/gachapon.html"
        },

        checkAllClaimed(){
            const allLockedAreFalse = this.missions.every(item => item.locked === false);
            console.log(allLockedAreFalse)
            if (allLockedAreFalse){
                this.allClaimed.locked = false;
            }
        },
    }
}
</script>
