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

    <div class="center-main-container form-container">
        <form @submit.prevent="setupProfile">
            <h1>Set up your profile</h1>

            <input
                type="text"
                placeholder="Name"
                v-model="realname"
                maxlength="32"
                required
                @input="noIntegers"
            />
            <input
                type="text"
                placeholder="Username"
                v-model="username"
                maxlength="25"
                required
                @input="verifyUsername"
            />

            <p class="warning normal-font-size" v-if="usernameErr">
                {{ this.usernameErr }}
            </p>

            <DynamicTextarea
                :placeholder="'Bio (Max 100 characters)'"
                v-model="biography"
                :maxlength="100"
                :padding="'1px 2px'"
            />

            <div id="interest-container">
                <label>Interests: </label>
                <AddInterestButton
                    :selectedOption="selectedOption"
                    @selectedInterests="handleSelectedInterests"
                />
            </div>

            <select v-model="selectedSchool" required>
                <option value="" disabled selected hidden>
                    Select a school
                </option>
                <option v-for="school in schools" :value="school">
                    {{ school }}
                </option>
            </select>

            <select
                v-model="selectedCourse"
                required
                :disabled="!selectedSchool"
            >
                <option value="" disabled selected hidden>
                    Select a Course
                </option>
                <option v-for="course in selectedSchoolCourses" :value="course">
                    {{ course }}
                </option>
            </select>

            <p class="warning">
                School and course cannot be modified in a later date. Please
                ensure that you have chosen the most accurate description of
                your course of study
            </p>

            <button
                type="submit"
                class="submit-button use-primary-secondary-gradient"
                :disabled="invalidFields"
            >
                Get Started
            </button>
        </form>
    </div>
</template>

<style scoped>
.form-container {
    width: 40%;
}

form p {
    width: 80%;
}
</style>

<style>
@import url("../../styles/main.css");
@import url("../../styles/login-register-styles.css");

.warning {
    color: red;
    font-size: 12px;
    text-align: center;
}

.warning.normal-font-size {
    font-size: 1em;
}

#interest-container {
    width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    column-gap: 20px;
}

@media screen and (max-width: 768px) {
    .form-container {
        width: 80% !important;
    }
}
</style>

<script>
import AddInterestButton from "../../components/general/AddInterestButton.vue";
import { useAlertStore } from "../../stores/AlertStore.js";
import AlertPrompt from "../../components/general/AlertPrompt.vue";
import DynamicTextarea from "../../components/general/DynamicTextarea.vue";
import redirectUser from "../../utils/authentication/redirectAuthenticatedUser.js";
import signOut from "../../utils/authentication/signOut.js";
import { debounce } from "lodash";
import LoadingOverlay from "../../components/general/LoadingOverlay.vue";

export default {
    components: {
        AddInterestButton,
        AlertPrompt,
        DynamicTextarea,
        LoadingOverlay,
    },

    data() {
        return {
            alert: useAlertStore().alert,
            alertStore: useAlertStore(),

            showLoading: false,

            realname: "",
            username: "",
            biography: "",
            selectedOption: [],
            selectedSchool: "",
            selectedCourse: "",
            schools: [],
            courses: [],

            setupComplete: false,

            usernameErr: null,
            errMsg: "",

            debouncedVerifyUsername: null,
            verifiedUsername: false,
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
        },
        // get courses based on selected school
        selectedSchoolCourses() {
            if (this.selectedSchool != "" || this.selectedSchool != null) {
                return this.courses[this.schools.indexOf(this.selectedSchool)];
            } else {
                return this.courses[0];
            }
        },
        // check if fields are valid
        invalidFields() {
            let detailsList = [
                this.realname,
                this.username,
                this.selectedSchool,
                this.selectedCourse,
            ];

            if (detailsList.some((item) => item.trim() == "")) {
                return (this.errMsg = "Please enter all fields");
            }

            if (/^[0-9]+$/.test(this.realname)) {
                return (this.errMsg =
                    "Your real name should not contain integers");
            }

            if (this.realname.length > 32) {
                return (this.errMsg =
                    "Maximum of 32 characters are allowed for real name");
            }

            if (this.usernameErr) {
                return (this.errMsg = "Invalid username");
            }

            if (this.username.length > 25) {
                return (this.errMsg =
                    "Maximum of 25 characters are allowed for username");
            }

            if (!this.schools.includes(this.selectedSchool)) {
                return (this.errMsg = "School does not exist");
            }

            if (!this.selectedSchoolCourses.includes(this.selectedCourse)) {
                return (this.errMsg = "Course does not exist");
            }

            this.errMsg = "";

            return;
        },
    },
    created() {
        // check if user has to set up profile
        const stayOnPage = sessionStorage.getItem("to_setup_profile");

        // if user already set up profile then redirect to feed
        if (!stayOnPage) {
            redirectUser();
            return;
        }

        this.getSchools();

        this.debouncedVerifyUsername = debounce(
            this.debounceVerifyUsernameFunction,
            1000,
        );

        window.addEventListener("unload", async (e) => {
            e.preventDefault();
            await this.signOut();
        });
    },
    methods: {
        // to sign user out if profile is not set up when leaving the page
        signOut() {
            return new Promise(async (resolve) => {
                if (!this.setupComplete) {
                    await signOut();
                }

                sessionStorage.removeItem("to_setup_profile");

                resolve();
            });
        },
        // get school and course information
        getSchools() {
            fetch(`${process.env.APP_SERVER_URL}/api/schools`, {
                method: "GET",
                mode: "cors",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error: " + response.error);
                    } else {
                        return response.json();
                    }
                })
                .then((data) => {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            this.schools.push(key);
                            this.courses.push(
                                Object.keys(data[key]["courses"]),
                            );
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
        handleSelectedInterests(selectedInterests) {
            // Retrieve the selected interests here and perform necessary actions
            // You can store the selected interests in a data property or send them to an API, etc.
            this.selectedOption = selectedInterests;
        },
        async setupProfile() {
            // do nothing if there are invalid fields
            if (this.invalidFields) {
                await this.alert(this.errMsg);
                return;
            }

            this.showLoading = true;

            this.userObject = {
                realName: this.realname,
                userName: this.username,
                biography: this.biography,
                selectedSchool: this.selectedSchool,
                selectedCourse: this.selectedCourse,
                selectedInterests: this.selectedOption,
            };

            fetch(
                `${
                    process.env.APP_SERVER_URL
                }/api/users/profile/setup`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify(this.userObject),
                    credentials: "include",
                },
            )
                .then((response) => {
                    if (response.status === 400) {
                        response.json().then(async (data) => {
                            await this.alert(data.message);
                        });
                    } else if (response.ok) {
                        this.setupComplete = true;
                        window.location.href = "/feed.html";
                    } else {
                        throw new Error(response.error);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            this.showLoading = false;
        },
        async verifyUsername() {
            this.verifiedUsername = false;
            this.debouncedVerifyUsername();
        },
        async debounceVerifyUsernameFunction() {
            try {
                const response = await fetch(
                    `${
                        process.env.APP_SERVER_URL
                    }/api/users/verify/username`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                        credentials: "include",
                        body: JSON.stringify({ username: this.username }),
                    },
                );

                if (response.ok) {
                    this.usernameErr = null;
                    this.verifiedUsername = true;
                    return;
                } else if (response.status === 400) {
                    const data = await response.json();

                    if (data.message === "Username already exists") {
                        this.usernameErr = "Username already taken";
                    } else {
                        throw new Error("Error: " + response.status);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
        noIntegers() {
            this.realname = this.realname.replace(/[0-9]/g, "");
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        },
    },
};
</script>
