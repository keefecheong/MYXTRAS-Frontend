<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <form>
                        <h2 id="header">Set up your profile</h2>
                        <input type="text" placeholder="Name" id="realnameField" v-model="realname" :required="!showPopup" @input="noIntegers">
                        <input type="text" placeholder="Username" id="usernameField" v-model="username" :required="!showPopup">
                        <textarea placeholder="Bio (Max 500 characters)" id="bioField" :required="!showPopup" style="appearance: none;" v-model="textareaValue" @input="limitCharacters"></textarea>
                        <div class="interest-container">  
                            <label for="inputInterest" style="display: block; margin-bottom: 5px; margin-left: 53px;">Interest: </label>
                            <div id="interest-badges">
                                <!-- <span class="badge bg-primary" id="interest-badge">Kpop</span>
                                <span class="badge bg-secondary" id="interest-badge">Games</span>
                                <span class="badge bg-success" id="interest-badge">Technology</span> -->
                                <!-- <div id="interest-badges" :class="getBadgeClass(option)" v-for="option in selectedOption" :key="option">
                                    <span class="badge" :class="getBadgeColor(option)">{{ option }}</span> -->
                                    <span v-for="option in selectedOption" id="interest-badge" :class="getBadgeClass(option)">{{ option }}</span>
                                <!-- </div> -->
                            </div>
                            <button type="button" class="btn rounded-circle btn-sm" id="custom-btn" @click="handleClick"><i class="bi bi-plus"></i></button>
                            
                        </div>
                        <!-- <modal :show="showPopup" @close="closeModal">
                            <h2>Popup Content</h2>
                            <p>Choose something:</p>
                            <button v-for="option in options" :key="option" @click="handleChoice(option)">{{ option }}</button>

                            <div class="button-container">
                            <button @click="cancelSelection">Cancel</button>
                            <button @click="confirmSelection">Confirm</button>
                            </div>
                        </modal> -->
                        <div v-if="showPopup" class="popup-container">
                            <div class="popup-content">
                                <h2>Interests</h2>
                                <p>Please select the interest(s) that suit you best:</p>
                                <button v-for="option in options" :class="getBadgeClass(option)" type="button" id="interest-badge" style="border-radius: 20px;" @click="handleChoice(option)">{{ option }}</button>

                                <div class="button-container">
                                <button @click="cancelSelection">Cancel</button>
                                <button @click="confirmSelection()">Confirm</button>
    
                                </div>
                            </div>
                        </div>
                        
                        

                        <!-- <div class="text-center">
                            <v-select
                                v-model="selectedSchool"
                                :items="schools"
                                label="Discipline"
                            ></v-select>
                        </div>
                        <div class="text-center">
                            <v-select
                                v-model="selectedCourse"
                                :items="courses[selectedSchool]"
                                label="Course"
                            ></v-select>
                        </div> -->

                        <select v-model="selectedSchool" :required="!showPopup">
                            <option value="" disabled>Select a school</option>
                            <option value="ICT">School of ICT</option>
                            <option value="HS">School of HS</option>
                            <option value="FMS">School of FMS</option>
                            <option value="BS">School of BS</option>
                        </select>
                        <br>
                        <br>
                        <select v-model="selectedCourse" :required="!showPopup">
                            <option value="" disabled>Select a course</option>
                            <option v-for="course in filteredCourses" :value="course">{{ course }}</option>
                        </select>
                        <br>
                        <br>
                        <p class="warning">Warning: Discipline and course cannot be modified in a later date. Ensure that <br> 
                            you have chosen the most accurate description of your course of study</p>
                        <br>
                        <button @click="checkDetails()" id="getStartedBtn">
                            Get Started
                        </button>
                    </form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100%;
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
    background-repeat: no-repeat;
    font-size: calc(.5em + 0.5vw) !important;
}
.whitebox {
    background-color: white;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 5vh !important;
    padding: 10vh 0;
    
}

input[type=text],
select,
textarea{
  border: none;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(90deg,#FF6363, #E53A73);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 2px;
  margin-bottom: 30px;
  width: 80%;
  padding-bottom: 10px;
  appearance: none;
}

input:focus,
textarea{
    background-size: 0% 2px;
    outline: none;
}

#header{
    margin-bottom: 60px;
}

.warning{
    color: #FF0000;
    font-size: 12px;
}

.v-select {
    width: 100%;
}

#getStartedBtn {
    width: 10em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
    border-radius: 10px;
    padding: 20px 25px;
}

#interest-badge{
    margin: 5px;
    padding: 10px;
}

.interest-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.interest-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.interest-container label {
  margin-right: 10px;
}

#custom-btn{
    color: #E53A73;
    border-color: #E53A73; 
    border-width: 2px;
    margin-left: 10px;
}

.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.badge-kpop {
    background-color: #FF7BE2;
}

.badge-games {
    background-color: #6FE5FF;
}

.badge-technology {
    background-color: #6FFFA8;
}

.badge-sports{
    background-color: #FFE27B;
}

.badge-dancing{
    background-color: #7B88FF;
}

.badge-jpop{
    background-color: #FFAB6F;
}

.badge-coding{
    background-color: #6F74FF;
}

.badge-lifestyle{
    background-color: #FC5454;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0 50%;
  }

  
}
</style>

<script>
import DropDown from '@/components/DropDown.vue'

export default {
    components: {
        DropDown,
  },

    data() {
        return {
            realname: "",
            username: "",
            selectedSchool: '',
            selectedCourse: '',
            textareaValue: '',
            maxCharacters: 500,
            showPopup: false,
            selectedOption: [],
            // schools: ['ICT','HS','FMS','BMS'],
            courses: {
                ICT: ['CSF', 'IM', 'CICT'],
                HS: ['CHEM', 'BIO'],
                FMS: ['FILM', 'MEDIA'],
                BS: ['MARKETING', 'HR']
            },
            options:[
                'Kpop',
                'Games',
                'Technology',
                'Sports',
                'Dancing',
                'JPOP',
                'Coding',
                'Lifestyle'
            ],

            
        };
    },
    computed: {
        filteredCourses() {
            return this.courses[this.selectedSchool] || [];
        }
    },
    methods: {
        checkDetails() {
            
        },
        limitCharacters() {
        if (this.textareaValue.length > this.maxCharacters) {
            // If the number of characters exceeds the limit
            this.textareaValue = this.textareaValue.slice(0, this.maxCharacters); // Truncate the input value to the maximum number of characters
            }
        },
        handleClick(){
            console.log("CLicked");
            this.showPopup = true;
        },
        handleChoice(option){
            console.log(option);
            const index = this.selectedOption.indexOf(option);
            if (this.selectedOption.includes(option)) {
                // Option is already selected, remove it from the array
                this.selectedOption = this.selectedOption.filter(item => item !== option);
            } else {
                // Option is not selected, add it to the array
                this.selectedOption.push(option);
            }
    //         this.selectedOption = option;
    //         this.showPopup = false;
        },

        cancelSelection(){
            this.selectedOption = [];
            this.showPopup = false;
        },

        confirmSelection() {
            // Perform any necessary actions with the selected options here
            console.log("Selected options:", this.selectedOption);
            this.showPopup = false;
        },

        getBadgeClass(option) {
            // Return a class name based on the selected option
            switch (option) {
            case 'Kpop':
                return 'badge badge-kpop';
            case 'Games':
                return 'badge badge-games';
            case 'Technology':
                return 'badge badge-technology';
            case 'Sports':
                return 'badge badge-sports'
            case 'Dancing':
                return 'badge badge-dancing'
            case 'JPOP':
                return 'badge badge-jpop'
            case 'Coding':
                return 'badge badge-coding'
            case 'Lifestyle':
                return 'badge badge-lifestyle'
            }
            return `badge-${bg-info}`;
        },

        // getBadgeColor(option) {
        //     // Return a class name for the badge color based on the selected option
        //     switch (option) {
        //     case 'Kpop':
        //         return 'bg-primary';
        //     case 'Games':
        //         return 'bg-secondary';
        //     case 'Technology':
        //         return 'bg-success';
        //     default:
        //         return 'bg-info';
        //     }


        //     'Kpop',
        //         'Games',
        //         'Technology',
        //         'Sports',
        //         'Dancing',
        //         'JPOP',
        //         'Coding',
        //         'Lifestyle'
        // },

        noIntegers() {
            this.realname = this.realname.replace(/[0-9]/g, '');
        }
    }
}
</script>