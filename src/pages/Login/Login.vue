<template>
    <AlertPrompt
        v-if="showAlert && alertMsg.length > 0"
        @close-alert="closeAlert"
    >
        {{ alertMsg }}
    </AlertPrompt>

    <LoadingOverlay
        v-if="showLoading"
        :backgroundColor="'rgba(0, 0, 0, 0.5)'"
        :center="true"
    />

    <div id="main-container" class="center-main-container">
        <img
            src="../../assets/ngeeannxtras.jpg"
            draggable="false"
            id="ngee-ann-banner"
        />

        <div class="form-container">
            <form @submit.prevent="loginUser">
                <h1>Log in</h1>

                <input
                    type="email"
                    placeholder="Email Address"
                    v-model="emailAddress"
                    required
                />

                <div class="password-field-container">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="password"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="button"
                        class="material-symbols-outlined"
                        id="show-password-button"
                        :class="{ 'show-password': showPassword }"
                        @click="hidePassword"
                    >
                        visibility_off
                    </button>
                </div>

                <div id="recaptcha-container"></div>

                <button
                    type="submit"
                    class="submit-button use-primary-secondary-gradient"
                >
                    Log in
                </button>
            </form>

            <a href="/registration.html" class="redirect-link">
                Don't have an account? Register Now!
            </a>
        </div>
    </div>
</template>

<style>
@import url("../../styles/main.css");
@import url("../../styles/login-register-styles.css");
@media screen and (max-width: 768px) {
    #ngee-ann-banner {
        display: none;
    }
    #main-container > * {
        width: 100vw !important;
    }
    #form-container {
        display: block;
    }
    #show-password-button {
        transform: translateY(-50%);
    }
}
</style>

<script>
import { useAlertStore } from "../../stores/AlertStore.js";
import AlertPrompt from "../../components/general/AlertPrompt.vue";
import firebase from "firebase";
import redirectUser from "../../utils/authentication/redirectAuthenticatedUser.js";
import LoadingOverlay from "../../components/general/LoadingOverlay.vue";

export default {
    data() {
        return {
            emailAddress: "",
            password: "",
            showPassword: false,
            recaptchaVerifier: null,
            alertStore: useAlertStore(),
            alert: useAlertStore().alert,
            showLoading: false,
        };
    },
    components: {
        AlertPrompt,
        LoadingOverlay,
    },
    created() {
        redirectUser();
    },
    mounted() {
        const self = this;
        this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "normal",
                callback: function (response) {
                    // reCAPTCHA verified, handle the callback
                    self.recaptchaClicked = true;
                },
                "expired-callback": () => {
                    // reCAPTCHA expired, handle the expired callback
                    console.log("reCAPTCHA expired!");
                },
            },
        );
        this.recaptchaVerifier.render().then((widgetId) => {
            this.recaptchaWidgetId = widgetId;
        });
    },
    methods: {
        hidePassword() {
            this.showPassword = !this.showPassword;
        },
        async loginUser() {
            if (!this.recaptchaClicked) {
                await this.alert("Please click on reCAPTCHA");
                return;
            }
            let credentialList = [this.emailAddress, this.password];
            if (credentialList.some((item) => item === "")) {
                await this.alert("Please enter all fields");
                return;
            }

            this.showLoading = true;

            const user = {
                emailAddress: this.emailAddress,
                password: this.password,
            };

            try {
                const response = await fetch(
                    `${process.env.APP_SERVER_URL}/api/users/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                        credentials: "include",
                        body: JSON.stringify(user),
                    },
                );

                if (response.ok) {
                    const data = await response.json();

                    // if user already set up profile go to feed
                    if (data.is_profile_setup) {
                        location.href = "/feed.html";
                    }
                    // otherwise go to setup profile
                    else {
                        sessionStorage.setItem("to_setup_profile", true);
                        location.href = "/setupProfile.html";
                    }
                } else {
                    const errorData = await response.json();

                    // Display the error message on the frontend
                    await this.alert(errorData.message);
                }
            } catch (error) {
                // Display a generic error message on the frontend
                await this.alert("An error occurred. Please try again later.");
            }

            this.showLoading = false;
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
        },
    },
};
</script>
