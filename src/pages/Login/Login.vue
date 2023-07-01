<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>
    
    <div id="main-container">
        <div id="main-content">
            <div class="row justify-content-center">
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" :draggable="isDraggable" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <h1>Log in</h1>
                        <input type="email" placeholder="Email Address" v-model="emailAddress" id="emailField" required>
                        <br/>
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" id="passwordField" required>
                        <button class="material-symbols-outlined overlay-button" :class="{ 'pressed': isPressed }" @click="hidePassword">visibility_off</button>
                        <br/>
                        <div id="recaptcha-container" style="width:300px;margin:auto;"></div>

                        <button @click="loginUser()" id="loginBtn">
                            Log in
                        </button>
                        <br>
                        <a href="/registration.html" id="registerBtn">
                            Don't have an account? Register Now!
                        </a>
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
    height: 100vh;
    background-repeat: no-repeat;
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
}
h1 {
    margin-bottom: 5vh !important;
}
#ngeeAnnBanner {
    opacity: 0.75;
    width: 100%;
    height: 100%;
}
.loginContainer {
    border-radius: 1000px !important;
    margin-top: 11vh !important;
}
#emailField {
    margin-bottom: 20px;
    width: 80%;
}
#passwordField{
    margin-bottom: 20px;
    width: 80%;
    transform: translatex(2vh);
}
#emailField,
#passwordField {
    padding-bottom: 10px;
}
#numberField, #otpField {
    transform: translatex(6vh);
}
.whitebox {
    background-color: white;
    position: relative;
    width: 100%;
    height: 100%;
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
input[type=email],
input[type=password] {
    border: none;
    border-bottom: 2px solid transparent;
    background-image: linear-gradient(45deg,#FF6363, var(--primary));
    background-position: 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 2px;
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
input:focus{
    background-size: 0% 2px;
    outline: none;
}

#loginBtn {
    width: 10em;
    height: 3em;
    color: white;
    margin-top: 5vh;
    border: none;
    background: linear-gradient(45deg,#FF6363, var(--primary));
}
#loginBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#registerBtn {
    color: black;
    text-decoration: none;
    position: absolute;
    bottom: 20px; /* Adjust the distance from the bottom as needed */
    left: 50%;
    transform: translateX(-50%);
}
#registerBtn::after {
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

#registerBtn:hover::after {
  transform: scaleX(1);
}
#registerBtn:hover{
    color: var(--primary);
}
.overlay-button {
    border: none;
    transform: translateX(-50%);
    background-color: transparent;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
}
.pressed {
    color: gray;
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
import { useAlertStore } from '../../stores/AlertStore.js';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import firebase from 'firebase';
import redirectUser from '../../utils/authentication/redirectAuthenticatedUser.js';

export default {
    data() {
        return {
            isDraggable: false,
            isPressed: false,
            emailAddress: '',
            password: '',
            showPassword: false,
            recaptchaVerifier: null,
            alertStore: useAlertStore(),
            alert: useAlertStore().alert
        }
    },
    components: {
        AlertPrompt
    },
    created() {
        redirectUser();
    },
    mounted() {
        const self = this;
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'normal',
            callback: function (response) {
                // reCAPTCHA verified, handle the callback
                self.recaptchaClicked = true
            },
            'expired-callback': () => {
                // reCAPTCHA expired, handle the expired callback
                console.log('reCAPTCHA expired!');
            }
        });
        this.recaptchaVerifier.render().then((widgetId)=>{
            this.recaptchaWidgetId = widgetId    
        })
    },
    methods: {
        hidePassword() {
            this.showPassword = !this.showPassword;
            this.isPressed = !this.isPressed;
        },
        async loginUser(){
            console.log(this.recaptchaClicked)
            if (!this.recaptchaClicked){
                await this.alert("Please click on reCAPTCHA")
                return;
            }
            let credentialList = [this.emailAddress, this.password];
            if (credentialList.some(item => item === "")){
                await this.alert("Please enter all fields");
                return;
            }
            else {
                this.userObject = {
                'emailAddress': this.emailAddress,
                'password': this.password
                }
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    credentials: 'include',
                    body: JSON.stringify(this.userObject),
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // if user already set up profile go to feed
                    if (data.is_profile_setup) {
                        location.href = '/feed.html';
                    }
                    // otherwise go to setup profile
                    else {
                        sessionStorage.setItem('to_setup_profile', true);
                        location.href = '/setupProfile.html';
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Error:', errorData.message);
                    // Display the error message on the frontend
                    await this.alert(errorData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                // Display a generic error message on the frontend
                await this.alert('An error occurred. Please try again later.');
            }
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
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
    }
}

</script>

