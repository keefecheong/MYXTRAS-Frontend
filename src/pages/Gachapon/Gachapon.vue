<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" class="gachaponBody">
            <Pet/>
            <div class="left-content">
                <div class="wallet-container">
                    <h2>
                        Your Wallet: <span class="material-symbols-outlined" style="display: inline;">account_balance_wallet</span>
                    </h2>
                    <p>{{ this.gems }}
                        <span class="material-symbols-outlined gemIcon">diamond</span>
                        <span v-if="deduction" style="color: red;">-{{ deduction }}</span>
                    </p>
                </div>
                <h2 class="header">
                    Your Pets Collection: 
                </h2>
                <div id="white-container">
                    <p v-if="inventoryPets.length == 0 " id="no-pets-text">No pets in inventory!</p>
                    <ul v-for="pet in inventoryPets">
                        <div id="pet-list-container">
                            <li id="petsList" class="listOptions">{{ pet.name }}
                                <div class="imageContainer">
                                    <img :src="pet.gif_link">
                                </div>
                            </li>
                            <li class="listOptions" :class="{'rainbow rainbow_text_animated' : pet.rarity === 'ultra rare'}" :style="getRarityStyle(pet.rarity)">
                                ({{ pet.rarity }})
                            </li>
                        </div>
                    </ul>
                </div>
                <h2 class="header">Settings</h2>
                <div class="settings-container">
                    <span id="enable-title" class="image-options-label">Enable Pets:</span>
                    <div id="settings-options">
                        <div id="settings-checkbox-container">
                            <input type="checkbox" class="checkbox" id="image-comments-checkbox" v-model="commentsEnabled" />
                            <label class="switch" for="image-comments-checkbox">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-content">
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
            
            <v-dialog v-model="showModal" max-width="500">
                <v-card class="v-theme--dark">
                    <v-card-title v-if="!insufficientGems">Rolled Pets</v-card-title>
                        <v-card-text>
                        <!-- Display the rolledPets data here -->
                        <ul v-if="!insufficientGems">
                            <li v-for="pet in rolledPets" :key="pet.name" class="listOptions" style="color: white;">{{ pet.name }} 
                                <span style="float: right;" v-if="pet.new">(New!)</span>
                                <span style="float: right;" v-if="!pet.new">
                                    Refunded 80 
                                    <span class="material-symbols-outlined gemIcon">diamond</span>
                                </span>
                                <p :class="{'rainbow rainbow_text_animated' : pet.rarity === 'ultra rare'}" :style="getRarityStyle(pet.rarity)">{{ pet.rarity }}</p>
                                <div class="imageContainer" style="width: 100%; text-align: center;">
                                    <img :src="pet.gif_link">
                                </div>
                                <hr v-if="rolledPets.length != 1">
                            </li>
                        </ul>
                        <p v-if="insufficientGems">
                            Insufficient gems! Need {{ this.gemsReq }} more gems.
                        </p>
                        </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="showModal = false; deduction = null" class="">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <Pets :enabled="enabled"/>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/gachapon.css');
.gemIcon {
    color: aqua !important;
    display: inline !important;
}
button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.imageContainer {
    max-height: 100%;   
}
.imageContainer > img {
    max-height: 10vh;
    text-align: center;
    justify-content: center;

}
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
.wallet-container {
    margin-bottom: 5rem;
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
    display: flex;
    background-color: white;
    border-radius: 10px;
    max-width: 50vw;
    min-width: 50vw;
    padding-right: 2rem;
    overflow-x: scroll;
}
#no-pets-text {
    color: black; 
    text-align: center; 
    width: 100%;
    margin: 1em 0;
}
.container {
    display: flex;
}
.left-content{
    flex: 1;
    max-width: 100%;
}
.right-content {
    flex: 2;
}
#buttons-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
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
    background-color: rgb(128, 0, 255);
}

#spinOneBtn:hover, #spinTenBtn:hover {
    animation: neonGlow 2s ease-in-out infinite alternate;

}

.listOptions {
    list-style-type: none;
    color: black;
}
#petsList {
    font-weight: bold;
    font-size: 1.2em;
}
#petsList, #rarityList{
    margin: 2em 0 0 1em;
}

.header {
    margin: 5rem 0 1rem 0;
}
#settings-options {
    margin-top: 1rem;
}
/* The switch - the box around the slider */
#settings-checkbox-container {
    width: 4em;
    height: 2em;
    padding: 0;
    position: relative;
    font-size: 0.8em;
}

/* Hide default HTML checkbox */
#image-comments-checkbox {
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
}

.switch {
    width: 100%;
    height: 100%;
    background-color: lightgray;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease-out;
}

/* The slider */
.slider {
    width: 2em;
    height: 2em;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-out;
    cursor: pointer;
}

.checkbox:checked + .switch {
    background-color: #34C759;
}

.checkbox:checked + .switch .slider {
    left: 2em;
    top: 0;
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
.rainbow_text_animated {
    background: linear-gradient(to right, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: rainbow_animation 6s ease-in-out infinite;
    background-size: 400% 100%;
}

@keyframes rainbow_animation {
    0%,100% {
        background-position: 0 0;
    }

    50% {
        background-position: 100% 0;
    }
}
#pet-list-container {
    min-width: 10rem;
}
</style>
<script>

export default {
    data() {
        return {
            gems: 0,
            showModal: false, 
            rolledPets: [],
            inventoryPets: [],
            insufficientGems: false,
            deduction: null,
            enabled: null
        }
    },
    created(){
        this.initData();
    },
    methods: {
        getRarityStyle(rarity) {
            let color;
            switch (rarity) {
                case 'ultra rare':
                    break;
                case 'rare':
                    color = 'orange';
                    break;
                case 'common':
                    color = 'blue';
                    break;
                default:
                    color = 'black'; // Default color for any other rarity (optional)
            }

            return {
                color: color,
            };
        },
        async initData(){
            // get user profile and follow status
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    // save user data
                    this.gems = data.gems
                    this.inventoryPets = data.pets.inventory.sort((a, b) => a.name.localeCompare(b.name));
                    this.inventoryPets = this.inventoryPets.sort((a, b) => {
                        const rarityOrder = { "ultra rare": 3, "rare": 2, "common": 1 };
                        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                    });
                    this.enabled = data.pets.enabled;
                });
            }).catch(error => {
                console.log(error);
            });
           
        },
        async rollGacha(numOfRolls){
            const cost = numOfRolls * 160

            if (((this.gems - cost) < 0)){
                this.insufficientGems = true;
                this.showModal = true;
                this.gemsReq = Math.abs(this.gems - cost)
                return
            }
            this.insufficientGems = false;
            this.gems -= cost
            this.deduction = cost
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon/${numOfRolls}`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include',
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.rolledPets = data;
                    this.showModal = true;
                    
                    // Push rolled pets (including duplicates into the users inventory)
                    for (const pet in this.rolledPets){
                        this.inventoryPets.push(this.rolledPets[pet])
                        if (!this.rolledPets[pet].new){
                            this.gems += 80
                            this.deduction -= 80
                        }
                    }
                    // Filter out unique elements based on a specific property (e.g., 'name')
                    this.inventoryPets = this.inventoryPets.filter((obj, index, arr) => {
                        return arr.findIndex((item) => item.name === obj.name) === index;
                    });

                    // Sort by alphabetical order
                    this.inventoryPets = this.inventoryPets.sort((a, b) => a.name.localeCompare(b.name));
                    
                    // sort by rarity
                    this.inventoryPets = this.inventoryPets.sort((a, b) => {
                        const rarityOrder = { "ultra rare": 3, "rare": 2, "common": 1 };
                        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                    });

                });
            }).catch((error) => {
                console.log(error);
            });
        },

        async enablePets(){
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon/enabled`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include',
            }).then(async (res) => {
                await res.json().then((data) => {
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>
