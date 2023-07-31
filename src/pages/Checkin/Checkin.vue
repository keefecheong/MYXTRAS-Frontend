<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div id="dailyLogInDiv">
                <div class="left-content">
                    <h1>Daily Log-in!</h1>
                    <p>Resets every week</p>
                    <div class="imageContainer">
                        <img src="../../assets/MP_JP_Pyroxene.png">
                    </div>
                </div>
                <div class="right-content">
                    <div id="scroll-view">
                        <div v-for="day in 7" :key="day" class="dayBox" :id="'day' + day">
                            <p>Day {{ day }}</p>
                            <p>{{ rewards[day - 1] }} <span class="material-symbols-outlined symbols" style="color: aqua;">diamond</span></p>
                            <br>
                            <button class="pink-btn material-symbols-outlined symbols locked" v-if="day > this.day">lock</button>
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
                            <div class="d-flex">
                                <p>{{ mission.gem_count }}</p>
                                <span class="material-symbols-outlined" style="color: aqua;">diamond</span>
                                <button class="pink-btn material-symbols-outlined symbols locked" v-if=mission.locked>lock</button>
                                <btn class="pink-btn" :class="{claimed : mission.claimed}" v-else="!missions.locked" @click="claimMission(mission.title)"><p>Claim</p></btn>
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
                            <div class="d-flex">
                                <p>500</p>
                                <span class="material-symbols-outlined" style="color: aqua;">diamond</span>
                                <btn class="pink-btn"><p>Claim</p></btn>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div id="pet">
                    <div id="runner"></div>
                    <div id="road"></div>
                </div> -->
                <Pets />
                <button id="bottom-right-button"><span class="material-symbols-outlined" @click="gachapon">shopping_cart</span></button>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
h1, p {
    color: white !important
}
h1 {
    text-align: left !important;
}

.symbols{
    float: right;
}
#dailyLogInDiv {
    display: flex;
    flex-direction: row;
    background-color: #0D283D;
    padding: 50px 100px 50px 100px;
    min-height: 40vh;
    margin-left: -20px;
}

#dailyTasksDiv {
    background-color: #1C1B25;
    padding: 50px 100px 50px 100px;
    min-height: 60vh;
    margin-left: -20px;
}
#scroll-view {
    overflow-x: scroll;
    display: flex;
    flex-direction: row;
    height: 100%;
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
    margin: 0 25px;
    padding: 25px 50px;
    text-align: center;
    min-width: 10vw;
}
.pink-btn {
    background-color: var(--primary);
    color:white;
    border-radius: 10px;
    padding: 0.5em;
}
.pink-btn:hover {
    background-color: transparent;
    border: 2px solid var(--primary);
    cursor: pointer;
    color:var(--primary);
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

/* #road{
    border-bottom: 7px dashed black;
} */

/* #pet{
    position: fixed;
    bottom: 0;
}

#runner{
    background: url("../../assets/panda_colour.png");
    width: 62.5px;
    height: 82.5px;
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;

}  */
/* 
#runner{
    background: url("../../assets/chicken.png");
    width: 85px;
    height: 101px;
    /* animation: walk 10s steps(8) infinite; */
    /* background-size: 750px 88.5px; */
/* 
#runner{
    background: url("../../assets/scoobydoo.png");
    width: 1100px;
    height: 82.5px;
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;

} */

/* @keyframes walk {
    0% {
        background-position: 0px;
        transform: translateX(0) scaleX(1);
    }
    49.999999999999% {
        background-position: 3000px;
        transform: translateX(1200px) scaleX(1);
    }
    50% {
        background-position: 3000px;
        transform: translateX(1200px) scaleX(-1);
    }
    100% {
        background-position: 0px;
        transform: translateX(0) scaleX(-1);
    }
} */
</style>

<script>

export default {
    data() {
        return {
            missions: null,
            rewards: [50, 100, 100, 100, 150, 200, 500],
            day: null,
            claimed: false,
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
                    console.log(data)
                    this.missions = data
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
                    console.log(this.day)
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
                    const targetMission = this.missions.find(mission => mission.title === targetTitle);
                    if (targetMission) {
                        // Update the claimed property to true
                        targetMission.claimed = true;
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        gachapon(){
            window.location.href = "/gachapon.html"
        }
    }
}
</script>
