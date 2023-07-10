<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
        <div id="main-content">
            <div class="row justify-content-center">
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" :draggable="false" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <form @submit.prevent="login">
                            <h1>Register Now!</h1>

                            <input 
                                v-model="emailAddress" 
                                type="email" 
                                placeholder="Email Address" 
                                id="emailField" 
                                required 
                                @input="verifyEmail">

                            <p class="genErr">{{ emailErr }}</p>

                            <!-- Password Field -->
                            <input 
                                title="Hint: At least 1 uppercase character, 1 numerical character, 1 special character, more than 8 characters"
                                :type="showPassword ? 'text' : 'password'" 
                                v-model="password" placeholder="Password" 
                                id="passwordField" 
                                class="custom-input" 
                                :maxlength="20"
                                required>

                            <button 
                                class="material-symbols-outlined overlay-button" 
                                :class="{ 'pressed': isPressed }" 
                                @click="hidePassword(1)"
                            >
                                visibility_off
                            </button>
                            
                            <div v-if="password != ''" >
                                <span class="material-symbols-outlined" :class="passwordRequirements" id="infoSym">info</span>
                                <p :class="passwordRequirements" id="passErr">{{ passwordStrengthMessage }}</p>
                            </div>

                            <input 
                                :type="showPasswordrepeated ? 'text' : 'password'" 
                                v-model="repeatedPassword" 
                                placeholder="Confirm Password" 
                                id="repeatPasswordField" 
                                :maxlength="20" 
                                required>

                            <button 
                                class="material-symbols-outlined overlay-button" 
                                :class="{ 'pressedrepeated': isPressedrepeated }" 
                                @click="hidePassword(2)"
                            >
                                visibility_off
                            </button>
                            
                            <!-- Phone Number Field -->
                            <input 
                                v-model="phoneNumber" 
                                type="text" 
                                placeholder="Phone Number" 
                                id="numberField" 
                                @input="() => {
                                    filterNumber();
                                    verifyPhone();
                                }" 
                                required 
                                :class="{ 'disabled': verifiedotp }" 
                                :disabled="verifiedotp">

                            <button 
                                @click="sendOTP" 
                                id="sendOtpBtn" 
                                class="overlay-button" 
                                :class="{ 'disabled': disableOTP }" 
                                :disabled="disableOTP"
                            >
                                Send OTP
                            </button>

                            <p v-if="showPhoneErr" id="phoneErr">Enter a valid phone number</p>
                            <p class="genErr">{{ phoneErr }}</p>

                            <!-- Reveals after OTP is sent -->
                            <input
                                v-if="otpSent" 
                                v-model="otp" 
                                type="text" 
                                placeholder="OTP" 
                                id="otpField" 
                                @input="() => {
                                    filterNumber();
                                    verifyPhone();
                                }" 
                                :maxlength="6" 
                                required 
                                :class="{ 'disabled': verifiedotp }">

                            <button 
                                v-if="otpSent" 
                                @click="verifyOTP" 
                                id="sendOtpBtn" 
                                class="overlay-button" 
                                :class="{ 'disabled': verifiedotp }"
                            >
                                Verify OTP
                            </button>
                            
                            <p v-if="verifiedotp" class="otp-verified">OTP verified</p>
                            <div id="recaptcha-container" style="width:300px;margin:auto;"></div>
                            
                            <p v-if="registerFail" class="genErr"> {{ generalErrMsg }}</p>

                            <button @click="registerUser()" id="registerBtn">
                                Register
                            </button>

                            <a href="/login.html" id="loginBtn">
                                Already have an account? Login Now!
                            </a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
  
<style>
@import url('../../styles/main.css');
body {
    background: linear-gradient(45deg,#FF6363, var(--primary));
    height: 115vh;
    background-repeat: no-repeat;
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
    
}

#phoneErr,
.genErr {
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
#ngeeAnnBanner, .whitebox {
    display:inline-block;
    width:50%;  
    vertical-align:middle;
}

input[type=text],
input[type=password],
input[type=email] {
    border: none;
    border-bottom: 2px solid transparent;
    background-image: linear-gradient(45deg,#FF6363, var(--primary));
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
    background: linear-gradient(45deg,#FF6363, var(--primary));
    transform: translateX(-3.3rem);
}
#sendOtpBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
.disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    background: linear-gradient(45deg,#FF6363, var(--primary));
}
#registerBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#passwordField, #repeatPasswordField{
    transform: translatex(1.4vh);
}

#numberField, #otpField {
    transform: translatex(6vh);
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
  background: linear-gradient(45deg,#FF6363, var(--primary));
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
.otp-verified {
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
import { debounce } from 'lodash';
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import redirectUser from '../../utils/authentication/redirectAuthenticatedUser.js';

export default {
    data() {
        return {
            alert: useAlertStore().alert,
            alertStore: useAlertStore(),

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
            isPressed: false,
            isPressedrepeated: false,
            showPhoneErr: false,
            showPassword: false,
            showPasswordrepeated: false,
            registerFail: false,
            otpSent: false,
            verifiedotp: false,
            disableOTP: true,
            // Error
            emailErr: null,
            phoneErr: null,

            // debounce
            debouncedVerifyEmail: null,
            debouncedVerifyPhone: null
        }
    },
    components: {
        AlertPrompt,
    },
    computed: {
        passwordRequirements() {
            const password = this.password;
            const consecutiveLimit = 3;

            // Minimum password length of 4 chars
            if (password.length < 8 || this.isPasswordSingleType(password)) {
                this.passwordStrengthMessage = "Password is very weak"
            return 'very-weak';
            }
            this.passwordStrength = 0;
            // Upper case char
            if (/[A-Z]/.test(password)) {
                this.passwordStrength++;
            }
            // Digits
            if (/\d/.test(password)) {
                this.passwordStrength++;
            }
            // Length >14 characters
            if (password.length > 14) {
                this.passwordStrength++;
            }
            // Special symbols
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
            } else if (this.passwordStrength === 2 || this.passwordStrength === 3) {
                this.passwordStrengthMessage = "Password is strong"
                return 'strong';
            } else {
                this.passwordStrengthMessage = "Password is very strong"
                return 'very-strong';
            }
        },
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
        redirectUser();

        // set debounce functions
        this.debouncedVerifyEmail = debounce(this.debounceVerifyEmailFunction, 1000);
        this.debouncedVerifyPhone = debounce(this.debounceVerifyPhoneFunction, 1000);
    },
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
        isPasswordSingleType(password) {
            const lowercaseRegex = /^[a-z]+$/;
            const uppercaseRegex = /^[A-Z]+$/;
            const symbolRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
            const numberRegex = /^[0-9]+$/;
            if (
                lowercaseRegex.test(password) ||
                uppercaseRegex.test(password) ||
                symbolRegex.test(password) ||
                numberRegex.test(password)
            ) {
                return true;
            }

            return false;
        },
        
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
                
                let phoneNum = "+65" + this.phoneNumber;
                firebase.auth().signInWithPhoneNumber(phoneNum, this.recaptchaVerifier)
                    .then(async (confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        this.confirmResult = confirmationResult
                        await this.alert("Sms Sent!")
                        this.otpSent = true;
                        document.getElementById("recaptcha-container").style.display = "none";
                    }).catch((error) => {
                    // Error; SMS not sent
                        console.log(error)
                    });
            }
            
        },
        async verifyOTP() {
            this.confirmResult.confirm(this.otp)
            .then(async (result)=>{
                await this.alert("OTP verified",result)
                this.verifiedotp = true
                this.disableOTP = true;
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
        async debounceVerifyEmailFunction() {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/verify/email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    credentials: "include",
                    body: JSON.stringify({ email: this.emailAddress })
                });
    
                if (response.ok) {
                    this.emailErr = null;
                    return;
                } else if (response.status === 400) {
                    const data = await response.json();
    
                    if (data.message === 'Email already exists') {
                        this.emailErr = "Email already taken";
                        return;
                    } else {
                        throw new Error('Error: ' + response.status);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        verifyEmail() {
            this.debouncedVerifyEmail();
        },
        async debounceVerifyPhoneFunction() {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/verify/phone`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    },
                    credentials: "include",
                    body: JSON.stringify({ phoneNumber: this.phoneNumber })
                });

                if (response.ok) {
                    this.phoneErr = null;
                    this.disableOTP = false;
                    return;
                } else if (response.status === 400) {
                    const data = await response.json();
                    if (data.message === 'Phone Number already exists') {
                        this.phoneErr = "Phone Number already taken";
                        this.disableOTP = true;
                        return;
                    } else {
                        throw new Error('Error: ' + response.status);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        verifyPhone() {
            if (this.phoneNumber.length !== 8){
                return;
            }

            this.debouncedVerifyPhone();
        },
        async registerUser() {
            if (!this.verifiedotp){
                return this.generalErrMsg = "Verify your phone number";
            }
            let userDetailsList = [this.emailAddress, this.phoneNumber, this.password];
            if (this.phoneNumber.length != 8){
                this.showNumError = true;
                this.registerFail = true;
                return this.generalErrMsg = "Invalid phone number";
            }
            // Password complexity check
            if (this.passwordStrength < 2){
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

            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
                body: JSON.stringify(this.userObject)
            }).then((response) => {
                if (response.ok) {
                    sessionStorage.setItem('to_setup_profile', true);
                    location.href = '/setupProfile.html';
                }
                else if (response.status === 400){
                    response.json().then(async (data) => {
                        await this.alert(data.message);
                        throw new Error(data.message)
                    });
                    return;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
        
    },
}
</script>

