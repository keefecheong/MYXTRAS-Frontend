<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" class="gachaponBody">
            <div id="left-content">
                <h2>
                    Your Wallet: 
                </h2>
                <p>{{ this.gems }}<span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                
                <h2>
                    Your Pets Collection: 
                </h2>
                <div id="white-container">
                </div>
                
            </div>
            <div id="right-content">
                <div class="machine">
                    <div id="redMachineHolder" class="gashaponHolder fitImg">
                        <img src="../../assets/red_machine_top.svg"/>
                        <div class="prizesHolder">
                            <img src="../../assets/red_glass_bg.svg"/>
                            
                            <div class="glassMask">
                                <div class="itemsWrapper"></div>
                                <div class="glassHolder">
                                    <img src="../../assets/red_glass.svg"/>
                                </div>
                            </div>
                        </div>
                        
                        <div class="machineHolder">
                            <img src="../../assets/red_machine_bottom.svg"/>
                            <div class="machineButton">
                                <img src="../../assets/red_button.svg"/>
                            </div>

                            <div class="machineDrop">
                                <img src="../../assets/drop.svg"/>
                                <div class="dropResult"></div>
                            </div>
                            <div class="finalResult"></div>
                        </div>
                    </div>

                </div>
                <div id="buttons-container">
                    <button id="spinOneBtn" @click="rollGacha(1)">Spin 1</button>
                    <button id="spinTenBtn" @click="rollGacha(10)">Spin 10</button>
                </div>
                <div id="buttons-container">
                    <p>160 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                    <p>1600 <span class="material-symbols-outlined" style="color: aqua;">diamond</span></p>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/gachapon.css');
.machine {
    max-width: 50%;
    margin: auto;
    margin-bottom: 2em;
}
.gashaponHolder {
    position: relative;
    width: 100%;
    margin-top: 50px;
}
.gachaponBody {
    display: flex;
    background-color: #1C1B25;
    padding: 5vh 5vw;
    color: white;
}
.material-symbols-outlined {
    display: inline;
}
#white-container {
    background-color: white;
    border-radius: 10px;
    min-height: 50vh;
    width: 100%;
}
#left-content, #right-content {
    flex: 1;
    padding: 0 2vw;
}
#buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
#left-content {
    display: flex;
    flex-direction: column;
}
#spinOneBtn, #spinTenBtn {
    padding: 10px;
    border: none;
    border-radius: 10px;
}
#spinOneBtn {
    background-color: orange;
}
#spinTenBtn {
    background-color: yellow;
}

#spinOneBtn:hover, #spinTenBtn:hover {
    animation: neonGlow 2s ease-in-out infinite alternate;

}
@keyframes neonGlow {
  0% {
    box-shadow: 0 0 5px #ffffff, 0 0 10px #c5c5c5, 0 0 30px #fefffb, 0 0 60px #c5c5c5;
  }
  50% {
    box-shadow: 0 0 5px #ffffff, 0 0 10px #c5c5c5, 0 0 30px #fefffb, 0 0 60px #c5c5c5;
  }
  100% {
    box-shadow: 0 0 5px #ffffff, 0 0 10px #c5c5c5, 0 0 30px #fefffb, 0 0 60px #c5c5c5;
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
            gems: 0,
        }
    },
    created(){
        this.initData();
    },
    methods: {
        async initData(){
            // get user profile and follow status
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    // save user data
                    this.gems = data
                });
            }).catch(error => {
                console.log(error);
            });
           
        },
        async rollGacha(numOfRolls){
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon/${numOfRolls}`, {
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
        }
    }
}
</script>
