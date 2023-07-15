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
                        <!-- <div class="dayBox" id="day1">
                            <p>Day 1</p>
                            <p>50 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn">Claim</btn>
                        </div>
                        <div class="dayBox" id="day2">
                            
                            <p>Day 2</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div>
                        <div class="dayBox" id="day3">
                            <p>Day 3</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div>
                        <div class="dayBox" id="day4">
                            <p>Day 4</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div>
                        <div class="dayBox" id="day5">
                            <p>Day 5</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div>
                        <div class="dayBox" id="day6">
                            <p>Day 6</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div>
                        <div class="dayBox" id="day7">
                            <p>Day 7</p>
                            <p>100 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined locked">lock</btn>
                        </div> -->

                        <div v-for="day in 7" :key="day" class="dayBox" :id="'day' + day">
                            <p>Day {{ day }}</p>
                            <p>{{ day == 1 ? '50' : '100' }} <span class="material-symbols-outlined symbols" style="color: aqua;">diamond</span></p>
                            <br>
                            <btn class="pink-btn material-symbols-outlined symbols" :class="{ locked: day != 1 }" v-if="day != 1">lock</btn>
                            <btn class="pink-btn" v-else>Claim</btn>
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
                                <btn class="pink-btn">Claim</btn>
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
                                <btn class="pink-btn">Claim</btn>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="bottom-right-button"><span class="material-symbols-outlined">shopping_cart</span></button>
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
/* 
.material-symbols-outlined {
    float: right;
}  */

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
    padding: 10px;
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
.locked {
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
    box-shadow: 0 0 5px #d81515, 0 0 20px #1809e7, 0 0 40px #a5ff0a, 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
  50% {
    box-shadow: 0 0 5px #d81515, 0 0 20px #1809e7, 0 0 40px var(--primary), 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
  100% {
    box-shadow: 0 0 5px #d81515, 0 0 20px var(--primary), 0 0 40px var(--primary), 0 0 60px var(--primary), 0 0 80px var(--primary);
  }
}
</style>
<script>
import NavSidebar from '../../components/general/NavSidebar.vue';

export default {
    components: {
        NavSidebar
    },
    data() {
        return {
            missions: [{'title':'Like 5 threads', 'gem_count':'100'},{'title':'Follow a new user', 'gem_count':'150'}, {'title':'Like 5 threads', 'gem_count':'100'},{'title':'Follow a new user', 'gem_count':'150'}],
        }
    }
}
</script>
