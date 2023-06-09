<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-1">
                    <a href="/feed.html">
                        <span class="material-symbols-outlined" style="color: white; margin: 15px 0 0 15px">home</span>
                    </a>
                </div>
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" :draggable="isDraggable" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <form @submit.prevent="login">
                            <h1>Register Now!</h1>
                            <input v-model="emailAddress" type="email" placeholder="Email Address" id="emailField" required>
                            <input v-model="phoneNumber" type="text" placeholder="Phone Number" id="numberField" @input="filterNumber" required>
                            <p v-if="showPhoneErr" id="phoneErr">Enter a valid phone number</p>
                            <br>
                            <button @click="sendOTP" id="sendOtpBtn">Send OTP</button>
                            <div id="recaptcha-container" style="background-color:#1b1a1a;width:300px;margin:auto;"></div>
                            <input v-if="otpSent" v-model="otp" type="text" placeholder="OTP" id="otpField" @input="filterNumber" required>
                            <button v-if="otpSent" @click="verifyOTP" id="sendOtpBtn">Verify OTP</button>
                            <p v-if="verifiedotp">OTP verified</p>
                            <br>
                            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" id="passwordField" :maxlength="20" required>
                            <button class="material-symbols-outlined overlay-button" :class="{ 'pressed': isPressed }" @click="hidePassword(1)">visibility_off</button>
                            <div v-if="password == ''" >
                                <p id="hint">Hint: At least 1 uppercase character, 1 numerical character, 1 special character, more than 8 characters</p>
                            </div>
                            <div v-if="password != ''" >
                                <span class="material-symbols-outlined" :class="passwordRequirements" id="infoSym">info</span>
                                <p :class="passwordRequirements" id="passErr">{{ passwordStrengthMessage }}</p>
                            </div>
                            <input :type="showPasswordrepeated ? 'text' : 'password'" v-model="repeatedPassword" placeholder="Confirm Password" id="repeatPasswordField" :maxlength="20" required>
                            <!-- :class="{ 'password-visible': showPassword }" -->
                            <button class="material-symbols-outlined overlay-button" :class="{ 'pressedrepeated': isPressedrepeated }" @click="hidePassword(2)">visibility_off</button>
                            <p v-if="registerFail" id="genErr"> {{ generalErrMsg }}</p>
                            <button @click="registerUser()" id="registerBtn">
                                Register
                            </button>
                            <a href="/login.html" id="loginBtn">
                                Already have an account? Login Now!
                            </a>
                        </form>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </div>

</template>
  
<style>
@import url('../../styles/main.css');
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 115vh;
    background-repeat: no-repeat;
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
    
}
#phoneErr,
#genErr {
    padding: 0 4em 0 4em;
    color: red; 
    font-weight: bold;
    
}
h1 {
    margin-bottom: 5vh !important;
}
#ngeeAnnBanner {
    opacity: 0.75;
    width: 120%;
    height: 120%;
}
.loginContainer {
    border-radius: 1000px !important;
    margin-top: 11vh !important;
}
.whitebox {
    background-color: white;
    position: relative; /* for the register btn to stick to the bottom */
    width: 120%;
    height: 120%;
    padding-top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

}
#ngeeAnnBanner,
.whitebox {
    display:inline-block;
    width:50%;  
    vertical-align:middle;
}

input[type=text],
input[type=password],
input[type=email] {
  border: none;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(45deg,#FF6363, #E53A73);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 2px;
  margin-bottom: 30px;
  width: 80%;
  padding-bottom: 10px;
}
input:focus{
    background-size: 0% 2px;
    outline: none;
}

#sendOtpBtn {
    width: 6em;
    height: 2em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#sendOtpBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#hint {
    padding: 0 5em 0 5em;
    font-size: 0.7em;
}
#registerBtn {
    width: 10em;
    height: 3em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#registerBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#passwordField, #repeatPasswordField {
    transform: translatex(2.7vh);
}
.overlay-button {
    border: none;
    transform: translateX(-100%);
    background-color: transparent;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
}
.pressed,.pressedrepeated {
    color: gray;
}
#loginBtn {
    color: black;
    text-decoration: none;
    position: absolute;
    bottom: 20px; /* Adjust the distance from the bottom as needed */
    left: 50%;
    transform: translateX(-50%);
}
#loginBtn::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(45deg,#FF6363, #E53A73);
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

#loginBtn:hover::after {
  transform: scaleX(1);
}
#loginBtn:hover{
    color: var(--primary);
}
#infoSym {
    display: inline-block;
}
#passErr{
    display: inline-block;
    margin: 0;
    transform: translate(0, -0.9vh);
}
.very-weak {
    color: red;
}
.weak {
    color: rgb(255, 128, 0);
}
.strong {
    color: #2ce05c;
}
.very-strong {
    color: rgb(30, 196, 30);
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
import firebase from 'firebase';

export default {
    data() {
        return {
            // Inputs
            emailAddress: '',
            phoneNumber: '',
            password: '',
            repeatedPassword: '',
            userObject: null,
            generalErrMsg: '',
            passwordStrengthMessage: '',
            passwordStrength: 0,
            otp: '',
            recaptchaVerifier: null,
            confirmResult: null,

            // Booleans
            isDraggable: false,
            isPressed: false,
            isPressedrepeated: false,
            showPhoneErr: false,
            showPassword: false,
            showPasswordrepeated: false,
            registerFail: false,
            otpSent: false,
            verifiedotp: false,
        }
    },
    computed: {
        
        passwordRequirements() {
            const password = this.password;
            const consecutiveLimit = 3;
            if (password.length < 4) {
                this.passwordStrengthMessage = "Password is very weak"
            return 'very-weak';
            }

            this.passwordStrength = 0;

            if (/[A-Z]/.test(password)) {
                this.passwordStrength++;
            }

            if (/\d/.test(password)) {
                this.passwordStrength++;
            }
            if (password.length > 8) {
                this.passwordStrength++;
            }
            if (password.length > 14) {
                this.passwordStrength++;
            }
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                this.passwordStrength++;
            }
            // checks for 3 consecutive characters
            for (let i = 0; i < password.length - consecutiveLimit + 1; i++) {
                let isConsecutive = true;
                for (let j = i + 1; j < i + consecutiveLimit; j++) {
                if (password[j] !== password[i]) {
                    isConsecutive = false;
                    break;
                }
                }
                if (isConsecutive) {
                    if (this.passwordStrength === 0){
                        break;
                    }
                    this.passwordStrength--;
                }
            }
            if (this.passwordStrength === 0) {
                this.passwordStrengthMessage = "Password is very weak"
                return 'very-weak';
            } else if (this.passwordStrength === 1) {
                this.passwordStrengthMessage = "Password is weak"
                return 'weak';
            } else if (this.passwordStrength === 2) {
                this.passwordStrengthMessage = "Password is strong"
                return 'strong';
            } else {
                this.passwordStrengthMessage = "Password is very strong"
                return 'very-strong';
            }
        },
    },
    // watch: {
    //     password() {
    //     // Perform additional actions based on the password changes
    //     // Update the UI dynamically
    //     }
    // },
    mounted() {
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('registerBtn',{
            'size':'invisible',
            'callback':(response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log(response)
            }
        })            
    },
    methods: {
        async sendOTP(){
            if (this.phoneNumber.length != 8 || this.phoneNumber === ''){
                return this.showPhoneErr = true;
            } else {
                this.showPhoneErr = false;
                // Send otp using Firebase
                this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
                this.recaptchaVerifier.render().then((widgetId)=>{
                this.recaptchaWidgetId = widgetId    
                })
                
                this.phoneNumber = "+65" + this.phoneNumber;
                firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
                    .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    this.confirmResult = confirmationResult
                    alert("Sms Sent!")
                    this.otpSent = true;
                    // ...
                    }).catch((error) => {
                    // Error; SMS not sent
                    // ...
                    });
            }
            
        },
        async verifyOTP() {
            this.confirmResult.confirm(this.otp)
            .then((result)=>{
                alert("Registeration Successfull!",result)
                this.verifiedotp = true
                console.log("correct otp")                
            })
            .catch((error)=>{
                console.log(error)
            })
        },
        hidePassword(num) {
            switch (num){
                case(1):
                    this.showPassword = !this.showPassword;
                    this.isPressed = !this.isPressed;
                    break;
                case(2):
                    this.showPasswordrepeated = !this.showPasswordrepeated;
                    this.isPressedrepeated = !this.isPressedrepeated;
                    break;
            }
                
        },
        filterNumber() {
        // Remove any non-numeric characters except the minus sign at the beginning
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '').slice(0, 8);
        },
        redirectUser(){
            fetch("http://127.0.0.1:8081/api/users/setupprofile", {
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
        async registerUser() {
            
            if (!this.verifiedotp){
                return this.generalErrMsg = "Verify your phone number";
            }
            var userDetailsList = [this.emailAddress, this.phoneNumber, this.password];
            if (this.phoneNumber.length != 8){
                this.showNumError = true;
                this.registerFail = true;
                return this.generalErrMsg = "Invalid phone number";
            }
            // Password complexity check
            if (this.passwordStrength <= 2){
                this.registerFail = true;
                return this.generalErrMsg = "Password is weak";
            }
            // Password confirm
            if (this.password !== this.repeatedPassword){
                this.registerFail = true;
                return this.generalErrMsg = "Password mismatch";
            }
            // Check for empty fields
            if (userDetailsList.some(item => item === '')){
                this.registerFail = true;
                return this.generalErrMsg = "Please enter all fields";
            }
            else {
                this.userObject = {
                'emailAddress': this.emailAddress,
                'phoneNumber': this.phoneNumber,
                'password': this.password
                }
            }
            // const dataObject = this.userObject;
            // localStorage.setItem('dataObject', JSON.stringify(dataObject));

            fetch(`http://127.0.0.1:8081/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
                body: JSON.stringify(this.userObject)
            }) .then(response => {
                if (response.ok) {
                    console.log('Success');
                    // const userId = data.userId;
                    // localStorage.setItem('userID', userId);
                    localStorage.setItem('email', this.emailAddress);
                    console.log("2")
                    
                    location.href = '/setupprofile.html';
                } else if (response.status === 400){
                    response.json().then(data => {
                    if (data.error === 'Email already exists') {
                        alert("Email already exists");
                        throw new Error('Email already exists')
                    }
                    else if (data.error === 'Phone Number already exists') {
                        alert("Phone Number already exists");
                        throw new Error('Phone Number already exists')
                    }
                    else {
                        throw new Error('Error: ' + response.status);
                    }
                    });
                    console.log("1")
                    return;
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                
            //console.log(this.userObject);
        },
        
    },
}
</script>

