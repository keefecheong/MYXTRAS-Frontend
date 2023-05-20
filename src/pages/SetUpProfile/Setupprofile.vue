<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <form>
                        <h2 id="header">Set up your profile</h2>
                        <input type="text" placeholder="Name" id="realnameField" v-model="realname" required>
                        <input type="text" placeholder="Username" id="usernameField" v-model="username" required>
                        <textarea placeholder="Bio (Max 100 words)" id="bioField" required></textarea>
                        <p>Interests: </p>
    
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

                        <select v-model="selectedSchool" required>
                            <option value="" disabled>Select a school</option>
                            <option value="ICT">School of ICT</option>
                            <option value="HS">School of HS</option>
                            <option value="FMS">School of FMS</option>
                            <option value="BS">School of BS</option>
                        </select>
                        <br>
                        <br>
                        <select v-model="selectedCourse" required>
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
select{
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

input:focus {
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
            // schools: ['ICT','HS','FMS','BMS'],
            courses: {
                ICT: ['CSF', 'IM', 'CICT'],
                HS: ['CHEM', 'BIO'],
                FMS: ['FILM', 'MEDIA'],
                BS: ['MARKETING', 'HR']
            }
            
        };
    },
    computed: {
        filteredCourses() {
            return this.courses[this.selectedSchool] || [];
        }
    },
    methods: {
        checkDetails() {
            
        }
    }
}
</script>