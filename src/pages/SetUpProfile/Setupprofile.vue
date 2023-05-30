<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <form @submit.prevent="login">
                        <h2 id="header">Set up your profile</h2>
                        <input type="text" placeholder="Name" id="realnameField" v-model="realname" :required="!showPopup" :maxlength="32" @input="noIntegers">
                        <input type="text" placeholder="Username" id="usernameField" v-model="username" :maxlength="16" :required="!showPopup">
                        <textarea placeholder="Bio (Max 500 characters)" id="bioField" style="appearance: none;" v-model="biography" @input="limitCharacters"></textarea>
                        <div class="interest-container">  
                            <label for="inputInterest" style="display: block; margin-bottom: 5px; margin-left: 53px;">Interest: </label>
                            <AdditionButton :selectedOption="selectedOption" @selectedInterests="handleSelectedInterests"/>
                        </div>
                        
                        <select v-model="selectedSchool" :required="!showPopup">
                            <option value="" disabled selected hidden>Select a school</option>
                            <option value="ICT">School of ICT</option>
                            <option value="HS">School of HS</option>
                            <option value="FMS">School of FMS</option>
                            <option value="BS">School of BS</option>
                        </select>
                        <br>
                        <br>
                        <select v-model="selectedCourse" :required="!showPopup">
                            <option value="" disabled selected hidden>Select a course</option>
                            <option v-for="course in filteredCourses" :value="course" :disabled="course === 'Select a school first'">{{ course }}</option>
                        </select>
                        <br>
                        <br>
                        <p class="warning">Warning: Discipline and course cannot be modified in a later date. Ensure that <br> 
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
import AdditionButton from '../../components/AdditionButton.vue'
export default {
    components: {
       AdditionButton,
  },

    data() {
        return {
            realname: '',
            username: '',
            selectedSchool: '',
            selectedCourse: '',
            biography: '',
            maxCharacters: 100,
            selectedOption: [],
            userId: '',
            // schools: ['ICT','HS','FMS','BMS'],
            courses: {
                '': ["Select a school first"],
                ICT: ['CSF', 'IM', 'CICT'],
                HS: ['CHEM', 'BIO'],
                FMS: ['FILM', 'MEDIA'],
                BS: ['MARKETING', 'HR']
            },
                        
        };
    },
    computed: {
        filteredCourses() {
            return this.courses[this.selectedSchool] || [];
        }
    },
    mounted() {
        this.checkForCookie();
        this.checkAuth();

    },

        methods: {
        limitCharacters() {
        if (this.biography.length > this.maxCharacters) {
            // If the number of characters exceeds the limit
            this.biography = this.biography.slice(0, this.maxCharacters); // Truncate the input value to the maximum number of characters
            }
        },

        handleSelectedInterests(selectedInterests) {
            // Retrieve the selected interests here and perform necessary actions
            console.log(selectedInterests);
            // You can store the selected interests in a data property or send them to an API, etc.
            this.selectedOption = selectedInterests;
        },
        checkForCookie(){
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch("http://127.0.0.1:8081/api/users/get-cookie", {
                    method: "GET",
                    headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    },
                    credentials: "include",
                })
                .then(response => {
                if (!response.ok) {
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
            fetch("http://127.0.0.1:8081/api/users", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.profilesetup === false){
                            this.redirectsetup();
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

        redirectUser(){
            fetch("http://localhost:8081/api/users/feed", {
                        method: "GET"
                })
                .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
                else if (!response.ok){
                    response.error()
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                
        },

        validationCheck(){
            var checkStatus = false
            var detailsList = [this.realname, this.username, this.selectedSchool, this.selectedCourse];
            var realname = this.realname;
            var username = this.username;
            var school = this.selectedSchool;
            var course = this.selectedCourse;
            console.log(Object.values(this.courses).flat())
            if (
            detailsList.some(item => item === "") ||
            /^[0-9]+$/.test(realname) ||
            realname.length > 32 ||
            username.length > 16 ||
            !(school in this.courses) ||
            !(Object.values(this.courses).flat().includes(course))
            ) {
                if (detailsList.some(item => item === "")) {
                    alert("Please enter all fields");

                } else if (/^[0-9]+$/.test(realname)) {
                    alert("No integers in your real name");

                } else if (realname.length > 32) {
                    alert("Real name must not be more than 32 characters long");

                } else if (username.length > 16) {
                    alert("Username must not be more than 16 characters long");

                } else if (!(school in this.courses)) {
                    alert("School does not exist");

                } else if (!Object.values(this.courses).flat().includes(course)) {
                    alert("Course does not exist");
                }
                return checkStatus;
            }
            return checkStatus = true;
        },
        async setupprofile() {
            // const dataObject = JSON.parse(localStorage.getItem('dataObject'));
            // console.log(dataObject); // Access the received data object
            if (!this.validationCheck()){
                console.log("1")
                return;
            }
            else {
                console.log('gu');
                this.userObject = {
                'realName': this.realname,
                'userName': this.username,
                'biography': this.biography,
                'selectedSchool': this.selectedSchool,
                'selectedCourse': this.selectedCourse,
                'selectedInterests': this.selectedOption,
                }
            }
           
            fetch(`http://127.0.0.1:8081/api/users/setup`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(this.userObject),
                credentials: "include",
            }) .then(response => {
                    if (!response.ok) {
                        throw new Error('Error: ' + response.status);
                    } else {
                        this.redirectUser();
                        return response.json();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                
            // console.log(this.userObject);
        },

        noIntegers() {
            this.realname = this.realname.replace(/[0-9]/g, '');
        },
    }
}
</script>