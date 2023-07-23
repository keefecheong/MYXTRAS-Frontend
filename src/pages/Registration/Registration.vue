<template>
    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container" class="center-main-container">
        <img src="../../assets/ngeeannxtras.jpg" :draggable="false" id="ngee-ann-banner">

        <div class="form-container">
            <form @submit.prevent="registerUser">
                <h1>Register Now!</h1>

                <input title="Please enter your email" v-model="emailAddress" type="email" placeholder="Email Address"
                    required @input="verifyEmail">

                <p class="registration-error" v-if="showEmailErr">Invalid email address</p>

                <!-- Password Field -->
                <div class="password-field-container">
                    <input
                        title="Hint: At least 1 uppercase character, 1 numerical character, 1 special character, more than 8 characters"
                        :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password"
                        class="registration-password-field" :maxlength="20" required>

                    <button type="button" class="material-symbols-outlined" :class="{ 'show-password': showPassword }"
                        @click="hidePassword(1)">
                        visibility_off
                    </button>

                    <div v-if="password != ''" id="password-strength-info">
                        <span class="material-symbols-outlined" :class="passwordRequirements">info</span>
                        <p :class="passwordRequirements" class="registration-error">{{ passwordStrengthMessage }}</p>
                    </div>
                </div>

                <div class="password-field-container">
                    <input title="Confirm your password" :type="showRepeatPassword ? 'text' : 'password'"
                        v-model="repeatedPassword" placeholder="Confirm Password" class="registration-password-field"
                        :maxlength="20" required>

                    <button type="button" class="material-symbols-outlined" :class="{ 'show-password': showRepeatPassword }"
                        @click="hidePassword(2)">
                        visibility_off
                    </button>
                </div>

                <!-- Phone Number Field -->
                <div class="phone-number-field-container">
                    <input title="Please enter your phone number" v-model="phoneNumber" type="text"
                        placeholder="Phone Number" id="numberField" @input="() => {
                            filterNumber();
                            verifyPhone();
                        }" required :disabled="otpSent">

                    <button type="button" @click="sendOTP" class="registration-otp-button use-primary-secondary-gradient"
                        :class="{ 'disabled': disableOTP }" :disabled="disableOTP || otpSent">
                        Send OTP
                    </button>

                    <p v-if="showPhoneErr" class="registration-error">Invalid phone number</p>
                </div>

                <!-- Reveals after OTP is sent -->
                <div class="phone-number-field-container">
                    <input v-if="otpSent" v-model="otp" type="text" placeholder="OTP" @input="() => {
                        filterNumber();
                        verifyPhone();
                    }" :maxlength="6" required :disabled="otpVerified">

                    <button type="button" v-if="otpSent" @click="verifyOTP"
                        class="registration-otp-button use-primary-secondary-gradient" :disabled="otpVerified">
                        Verify OTP
                    </button>

                    <p v-if="otpVerified" class="otp-verified">OTP verified</p>
                </div>

                <div id="recaptcha-container"></div>

                <p v-if="registerFail" class="registration-error"> {{ generalErrMsg }}</p>

                <button type="submit" class="submit-button use-primary-secondary-gradient" :disabled="invalidFields">
                    Register
                </button>
            </form>

            <a href="/login.html" class="redirect-link">
                Already have an account? Login Now!
            </a>
        </div>
    </div>
</template>
  
<style>
@import url('../../styles/main.css');
@import url('../../styles/login-register-styles.css');

.registration-error {
    color: red;
    font-weight: bold;
}

#password-strength-info {
    display: flex;
    flex-direction: row;
    column-gap: 5px;
    align-items: center;
}

#password-strength-info p {
    margin: 0;
}

.registration-otp-button {
    width: 6em;
    height: 2em;
    box-sizing: border-box;
    color: white !important;
    top: -15px;
}

.registration-otp-button:hover {
    background: transparent;
    color: var(--primary) !important;
    font-weight: bolder;
    border: 3px solid var(--primary);
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
            generalErrMsg: '',
            passwordStrengthMessage: '',
            passwordStrength: 0,
            otp: '',
            recaptchaVerifier: null,
            confirmResult: null,

            // Booleans
            showPassword: false,
            showRepeatPassword: false,
            registerFail: false,
            otpSent: false,
            otpVerified: false,
            disableOTP: true,
            
            // Error
            showPhoneErr: false,
            showEmailErr: false,

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
                    if (this.passwordStrength === 0) {
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
        },
        // check for empty or invalid fields
        invalidFields() {
            let userDetailsList = [this.emailAddress, this.phoneNumber, this.password];

            // Check for empty fields
            if (userDetailsList.some(item => item === '')) {
                return this.generalErrMsg = "Please enter all fields";
            }
            
            if (this.showEmailErr) {
                return this.generalErrMsg = 'Invalid email address';
            }

            if (this.phoneNumber.length != 8) {
                return this.generalErrMsg = "Invalid phone number";
            }

            if (!this.otpVerified) {
                return this.generalErrMsg = "Please verify your phone number";
            }

            // Password complexity check
            if (this.passwordStrength < 2) {
                return this.generalErrMsg = "Password is weak";
            }

            // Password confirm
            if (this.password !== this.repeatedPassword) {
                return this.generalErrMsg = "Passwords do not match";
            }

            return null;
        }
    },
    created() {
        redirectUser();

        // set debounce functions
        this.debouncedVerifyEmail = debounce(this.debounceVerifyEmailFunction, 1000);
        this.debouncedVerifyPhone = debounce(this.debounceVerifyPhoneFunction, 1000);
    },
    mounted() {
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('register-button', {
            'size': 'invisible',
            'callback': (response) => {
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

        async sendOTP() {
            if (this.phoneNumber.length != 8 || this.phoneNumber === '') {
                return this.showPhoneErr = true;
            } else {
                this.showPhoneErr = false;
                // Send otp using Firebase
                this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
                this.recaptchaVerifier.render().then((widgetId) => {
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
                .then(async (result) => {
                    await this.alert("OTP verified", result)
                    this.otpVerified = true
                    this.disableOTP = true;
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        hidePassword(num) {
            if (num == 1) {
                this.showPassword = !this.showPassword;
            }
            else {
                this.showRepeatPassword = !this.showRepeatPassword;
            }
        },
        filterNumber() {
            // Remove any non-numeric characters except the minus sign at the beginning
            this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '').slice(0, 8);
        },
        async debounceVerifyEmailFunction() {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/verify/email`, {
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({ email: this.emailAddress })
                });

                if (response.ok) {
                    this.showEmailErr = false;
                } else if (response.status === 400) {
                    const data = await response.json();

                    if (data.message === 'Email already exists') {
                        this.showEmailErr = true;
                    } else {
                        throw new Error('Error: ' + response.status);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        verifyEmail() {
            this.showEmailErr = false;

            if (!this.emailAddress) {
                return;
            }

            this.debouncedVerifyEmail();
        },
        async debounceVerifyPhoneFunction() {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/verify/phone`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({ phoneNumber: this.phoneNumber })
                });

                if (response.ok) {
                    this.showPhoneErr = false;
                    this.disableOTP = false;
                }
                else {
                    const data = await response.json();

                    if (data.message === 'Phone number already exists') {
                        this.showPhoneErr = true;
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
            this.showPhoneErr = false;

            if (this.phoneNumber.length != 8) {
                return;
            }

            this.debouncedVerifyPhone();
        },
        async registerUser() {
            if (this.invalidFields) {
                this.registerFail = true;
                return;
            }

            user = {
                'emailAddress': this.emailAddress,
                'phoneNumber': this.phoneNumber,
                'password': this.password
            }

            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
                body: JSON.stringify(user)
            }).then((response) => {
                if (response.ok) {
                    sessionStorage.setItem('to_setup_profile', true);
                    location.href = '/setupProfile.html';
                }
                else {
                    response.json().then(async (data) => {
                        await this.alert(data.message);
                        throw new Error(data.message)
                    });
                }
            }).catch(error => {
                    console.error('Error:', error);
                });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
    }
}
</script>

