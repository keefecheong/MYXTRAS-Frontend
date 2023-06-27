<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <form @submit.prevent="login">
                        <h2 id="header">Set up your profile</h2>
                        <input type="text" placeholder="Name" id="realnameField" v-model="realname" :required="!showPopup" :maxlength="32" @input="noIntegers">
                        <input type="text" placeholder="Username" id="usernameField" v-model="username" :maxlength="25" :required="!showPopup">
                        <DynamicTextarea :placeholder="'Bio (Max 100 characters)'" v-model="biography" :maxlength="100" id="bio" />
                        <div class="interest-container">  
                            <label for="inputInterest" style="display: block; margin-bottom: 5px; margin-left: 53px;">Interest: </label>
                            <AddInterestButton :selectedOption="selectedOption" @selectedInterests="handleSelectedInterests"/>
                        </div>
                        
                        <select v-model="selectedSchool" :required="!showPopup">
                            <option value="" disabled selected hidden>Select a school</option>
                            <option v-for="school in schools" :value="school">{{ school }}</option>
                        </select>
                        <br/>
                        <br/>
                        <select v-if="selectedSchool != '' || selectedSchool != null" v-model="selectedCourse" :required="!showPopup">
                            <option value="" disabled selected hidden>Select a Course</option>
                            <option v-for="course in selectedSchoolCourses" :value="course">{{ course }}</option>
                        </select>
                        <br>
                        <br>
                        <p class="warning">Warning: School and course cannot be modified in a later date. Ensure that <br> 
                            you have chosen the most accurate description of your course of study</p>
                        <br>
                        <button @click="setupprofile()" id="getStartedBtn">
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

#bio {
    margin-left: 50px;
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

.interest-container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.interest-container label {
  margin-right: 10px;
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
import AddInterestButton from '../../components/general/AddInterestButton.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import DynamicTextarea from '../../components/general/DynamicTextarea.vue';

export default {
    components: {
       AddInterestButton,
       AlertPrompt,
       DynamicTextarea
    },

    data() {
        return {
            realname: '',
            username: '',
            selectedSchool: '',
            selectedCourse: '',
            biography: '',
            selectedOption: [],
            userId: '',
            schools: [],
            courses: [],
            schoolData: null,
            alert: useAlertStore().alert,
            alertStore: useAlertStore()
        };
    },
    computed: {
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        }
    },
    created() {
        this.checkForCookie();
        this.checkAuth();
        this.getSchools();
    },
    methods: {
        getSchools() {
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/schools`, {
                method: 'GET',
                mode: 'cors'
            }) .then(response => {
                    if (!response.ok) {
                        throw new Error('Error: ' + response.error);
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    this.schoolData = data;
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            this.schools.push(key);
                            this.courses.push(Object.keys(data[key]["courses"]));
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        handleSelectedInterests(selectedInterests) {
            // Retrieve the selected interests here and perform necessary actions
            // You can store the selected interests in a data property or send them to an API, etc.
            this.selectedOption = selectedInterests;
        },
        checkForCookie(){
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
                    method: "GET",
                    headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    },
                    credentials: "include",
                })
                .then(response => {
                if (!response.ok) {
                    window.location.href = '/feed.html';
                    console.log("fail");
                }
                else if (response.ok){
                    console.log('Success:');
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },

        checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.is_profile_setup === true){
                            window.location.href = '/feed.html';
                            return;
                        }
                        else {
                            this.userId = data._id;
                        }
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                    })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

        async validationCheck(){
            let detailsList = [this.realname, this.username, this.selectedSchool, this.selectedCourse];
            
            if (detailsList.some(item => item.trim() === "")) {
                await this.alert("Please enter all fields");
                return false;
            }
            
            if (/^[0-9]+$/.test(this.realname)) {
                await this.alert("No integers in your real name");
                return false;
            }
            
            if (this.realname.length > 32) {
                await this.alert("Real name must not be more than 32 characters long");
                return false;
            }
            
            if (this.username.length > 16) {
                await this.alert("Username must not be more than 16 characters long");
                return false;
            }
            
            if (!(this.selectedSchool in this.schools)) {
                await this.alert("School does not exist");
                return false;
            }
            
            if (!this.selectedCourse in this.selectedSchoolCourses) {
                await this.alert("Course does not exist");
                return false;
            }

            return true;
        },
        async setupprofile() {
            if (!this.validationCheck()){
                return;
            }
            else {
                this.userObject = {
                    'realName': this.realname,
                    'userName': this.username,
                    'biography': this.biography,
                    'selectedSchool': this.schoolData[this.selectedSchool]["short"],
                    'selectedCourse': this.schoolData[this.selectedSchool]["courses"][this.selectedCourse],
                    'selectedInterests': this.selectedOption,
                }
            }
           
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile/setup`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(this.userObject),
                credentials: "include",
            }) .then(response => {
                    if (response.status === 400) {
                        response.json().then(async (data) => {
                            await this.alert(data.error);
                            throw new Error(data.error)
                        });
                        return;
                    } else if (response.ok){
                        window.location.href = '/feed.html';
                    } else {
                        throw new Error(response.error)
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
                
            // console.log(this.userObject);
        },

        noIntegers() {
            this.realname = this.realname.replace(/[0-9]/g, '');
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
    },
    computed: {
        selectedSchoolCourses() {
            if (this.selectedSchool != '' || this.selectedSchool != null) {
                return this.courses[this.schools.indexOf(this.selectedSchool)];
            }
            else {
                return this.courses[0];
            }
        }
    }
}
</script>