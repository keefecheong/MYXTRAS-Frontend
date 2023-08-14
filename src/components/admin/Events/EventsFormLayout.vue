<template>
    <LoadingOverlay
        :backgroundColor="'rgba(0, 0, 0, 0.5)'"
        :center="true"
        v-if="submitting || (editMode && !dataInitialized)"
    />

    <div class="form-overlay">
        <form class="form-overlay-content" @submit.prevent="submitForm">
            <button class="form-overlay-close" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>

            <h1>{{ editMode ? "Edit Event" : "Create New Event" }}</h1>

            <!-- Upload banner -->
            <div id="event-banner-container">
                <label
                    for="event-banner-input"
                    v-if="!editMode && !bannerObject && !selectedBanner"
                    id="event-banner-none"
                    >No image selected</label
                >
                <span
                    v-if="bannerObject && bannerErrors.length > 0"
                    class="errMsg"
                    >Invalid file</span
                >
                <img
                    v-if="selectedBanner"
                    :src="selectedBanner"
                    alt="Banner"
                    id="event-banner-picture"
                />
                <input
                    id="event-banner-input"
                    type="file"
                    @change="fileChanged"
                    accept=".jpg, .jpeg, .png"
                />

                <label for="event-banner-input" id="event-banner-label"
                    ><u>Click</u> to Select Event Banner:</label
                >

                <!-- inform user about invalid file -->
                <div v-if="bannerErrors.length > 0">
                    <span>Error:</span>
                    <br />
                    <p v-for="error in bannerErrors" class="errMsg">
                        {{ error }}
                    </p>
                </div>
            </div>

            <!-- input for event name -->
            <div class="event-options-container">
                <label
                    for="event-name"
                    id="name-title"
                    class="event-options-label"
                    >Event Title:</label
                >
                <input
                    type="text"
                    id="event-name"
                    name="event-name"
                    placeholder="Max 50 Character"
                    v-model="name"
                    maxlength="50"
                />
            </div>

            <!-- input for event description -->
            <div class="event-options-container">
                <label
                    for="event-description"
                    id="description-title"
                    class="event-options-label"
                    >Description:</label
                >
                <DynamicTextarea
                    :id="'event-description'"
                    :placeholder="'Description of the event'"
                    v-model="description"
                />
            </div>

            <!-- input for event location -->
            <div class="event-options-container">
                <label
                    for="event-location"
                    id="location-title"
                    class="event-options-label"
                    >Location:</label
                >
                <input
                    type="text"
                    id="event-location"
                    name="event-location"
                    placeholder="Location"
                    v-model="location"
                    maxlength="200"
                />
            </div>

            <div id="event-date-container">
                <label
                    for="event-date-time"
                    id="date-title"
                    class="event-options-label"
                    >Date & Time:</label
                >
                <div class="event-date-time-picker">
                    <VueCtkDateTimePicker
                        v-model="selectedDateTime"
                        :format="'DD-MM-YYYY HH:mm'"
                        :firstDayOfWeek="1"
                    />
                </div>
                <div class="color-picker"></div>
                <input
                    class="color-result"
                    type="text"
                    placeholder="Color Hex Value"
                    maxlength="7"
                    v-model="color"
                    readonly
                />
            </div>

            <div id="event-form-controls">
                <input
                    class="form-overlay-control-button"
                    type="reset"
                    value="Clear All"
                    @click="resetAll"
                />
                <!--
                    disable submit button if
                    1. not in edit mode and no files are selected
                    2. files are selected but there are errors
                    3. in edit mode and no fields are changed and no files are changed
                    4. submit in progress
                -->
                <input
                    class="form-overlay-control-button"
                    type="submit"
                    :value="submitting ? 'Loading...' : 'Submit'"
                    :disabled="submitting || !requiredFields"
                />
            </div>
        </form>
    </div>
</template>

<script>
import DynamicTextarea from "../../general/DynamicTextarea.vue";
import { useAlertStore } from "../../../stores/AlertStore.js";
import LoadingOverlay from "../../general/LoadingOverlay.vue";
import Pickr from "@simonwep/pickr";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";

export default {
    components: {
        DynamicTextarea,
        LoadingOverlay,
        VueCtkDateTimePicker,
    },
    data() {
        return {
            bannerObject: null,
            bannerErrors: [],
            selectedBanner: null,
            invalidFiles: "",
            description: "",
            location: "",
            name: "",
            color: "#FF6363",
            submitting: false,
            alert: useAlertStore().alert,
            pickr: null,
            bannerUpdated: false,
            selectedDateTime: new Date(),
            dataInitialized: false,
        };
    },
    props: ["event"],
    emits: ["close-event-form"],
    created() {
        if (this.editMode) {
            this.selectedBanner = this.event.banner_link;
            this.description = this.event.event_desc;
            this.location = this.event.event_location;
            this.name = this.event.event_name;
            this.color = this.event.event_color;
            this.selectedDateTime = this.event.event_date;

            this.dataInitialized = true;
        }
    },
    mounted() {
        this.initColorPicker();
        this.setDateTime();
    },
    methods: {
        // to close the form
        closeForm() {
            this.$emit("close-event-form");
        },
        // to handle change in selected files
        fileChanged(e) {
            // if no files selected then clear relevant fields and return
            if (e.target.files.length <= 0) {
                this.bannerObject = null;
                this.selectedBanner = null;
                this.bannerErrors = [];

                return;
            }

            if (this.editMode) {
                this.bannerUpdated = true;
            }

            // valid conditions
            const acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(
                ", ",
            )}`;
            const largeFile = `File is too large, maximum file size is ${
                maxImageSize / 1024 / 1024
            }MB.`;

            // check for errors
            const errors = [];

            if (e.target.files[0].size > maxImageSize) {
                errors.push(largeFile);
            }

            if (!acceptedFileTypes.includes(e.target.files[0].type)) {
                errors.push(illegalFileType);
            }

            // set files and errors
            this.bannerObject = e.target.files[0];
            this.bannerErrors = errors;
            this.selectedBanner = null;

            // return if there are errors
            if (errors.length > 0) {
                return;
            }

            // otherwise preview images
            this.selectedBanner = URL.createObjectURL(this.bannerObject);
        },
        // to clear files and errors on reset
        resetAll() {
            this.banner = null;
            this.errors = [];
            this.selectedBanner = null;
            this.invalidFiles = "";
            this.description = "";
            this.location = "";
            this.name = "";
            this.selectedDateTime = new Date();
            this.time = "";
            this.color = "";
        },
        // submit forum form
        async submitForm() {
            this.submitting = true;

            // if in edit mode, check if user changed any fields
            if (this.editMode) {
                // if user has not changed any fields then do nothing
                if (!this.fieldsChanged && !this.bannerUpdated) {
                    await this.alert("No changes made.");
                    this.submitting = false;
                    return;
                }
            }

            // do nothing if required fields are not filled up
            if (!this.requiredFields) {
                await this.alert("Please fill up all required fields.");
                this.submitting = false;
                return;
            }

            const uploadData = new FormData();

            // add picture and banner only if they are updated in edit mode or if not in edit mode
            if ((this.editMode && this.bannerUpdated) || !this.editMode) {
                uploadData.append("selectedImages", this.bannerObject);
            }

            // tell server picture or banner is unchanged if so
            if (this.editMode && !this.bannerUpdated) {
                uploadData.append("bannerUnchanged", true);
            }

            try {
                var eventObject = {
                    event_name: this.name.trim(),
                    event_desc: this.description.trim(),
                    event_location: this.location.trim(),
                    event_date: Date(this.selectedDateTime),
                    event_color: this.color.trim(),
                };

                uploadData.append("eventObject", JSON.stringify(eventObject));

                // send request to server with data
                const baseURL = `${
                    import.meta.env.VITE_APP_SERVER_URL
                }/api/events`;
                const targetURL = this.editMode
                    ? `${baseURL}/${this.event._id}`
                    : baseURL;

                const options = {
                    mode: "cors",
                    method: this.editMode ? "PATCH" : "POST",
                    body: uploadData,
                    credentials: "include",
                };

                const successMessage = this.editMode
                    ? "Event updated."
                    : "Event created.";

                await fetch(targetURL, options)
                    .then(async (response) => {
                        if (response.ok) {
                            await this.alert(successMessage);
                        } else {
                            const data = await response.json();
                            await this.alert(data.message);
                        }

                        this.submitting = false;
                        location.href = "/admin/events.html";
                        return;
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } catch (error) {
                console.error("Error:", error);
            }
        },
        initColorPicker() {
            // Simple example, see optional options for more configuration.
            this.pickr = Pickr.create({
                el: ".color-picker",
                theme: "monolith", // 'classic' or 'monolith', or 'nano'
                default: this.color,
                padding: 10,
                lockOpacity: false,

                swatches: [
                    "#F44336",
                    "#E91E63",
                    "#9C27B0",
                    "#673AB7",
                    "#3F51B5",
                    "#2196F3",
                    "#03A9F4",
                    "#00BCD4",
                    "#009688",
                    "#4CAF50",
                    "#8BC34A",
                    "#CDDC39",
                    "#FFEB3B",
                    "#FFC107",
                ],

                components: {
                    // Main components
                    preview: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        input: true,
                        clear: true,
                        save: true,
                    },
                },
            });
            this.pickr.on("save", (color, instance) => {
                this.color = color.toHEXA().toString();
                document.querySelector(".color-result").value = this.color;
            });
        },
        setDateTime() {
            const now = new Date();
            const options = {
                timeZone: "Asia/Singapore",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            };
            this.selectedDateTime = now.toLocaleString("en-SG", options);
        },
    },
    computed: {
        // check if required fields are all filled up
        requiredFields() {
            let nameValid = this.name.trim().length > 0;
            let bannerValid = this.selectedBanner && this.bannerObject;
            let descValid = this.description.trim().length > 0;
            let locationValid = this.location.trim().length > 0;
            let colorValid = this.color.trim().length > 0;
            let selectedDateTimeValid = this.selectedDateTime;

            // if in edit mode, set picValid and bannerValid to true if no changes are made
            if (this.editMode) {
                bannerValid = bannerValid
                    ? bannerValid
                    : !this.bannerUpdated && this.selectedBanner;
            }

            return (
                nameValid &&
                bannerValid &&
                descValid &&
                locationValid &&
                colorValid &&
                selectedDateTimeValid
            );
        },
        // to check if any fields are changed
        fieldsChanged() {
            const nameSame = this.name == this.event.event_name;
            const descSame = this.description == this.event.event_desc;
            const locationSame = this.location == this.event.event_location;
            const colorSame = this.color == this.event.event_color;
            const dateSame = this.selectedDateTime == this.event.event_date;

            return !(
                nameSame &&
                descSame &&
                locationSame &&
                colorSame &&
                dateSame
            );
        },
        // check if in edit mode
        editMode() {
            return this.event != null;
        },
    },
};
</script>

<style>
@import url("../../../styles/forms/form-overlay-styles.css");

.event-options-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    justify-content: start;
    align-items: center;
    width: 80%;
    text-align: start;
}

#event-banner-container {
    display: flex;
    row-gap: 20px;
    flex-direction: column;
    color: white;
    align-items: center;
    width: 100%;
}

#event-banner-label {
    font-size: 1.2em;
    cursor: pointer;
}

#event-banner-none,
#event-banner-picture {
    width: 80%;
    height: 9rem;
    background-color: white;
    border-radius: 20px;
    color: black;
    display: flex;
    align-items: center;
    object-fit: cover;
    justify-content: center;
}

#event-banner-none:hover {
    cursor: pointer;
    color: var(--primary);
}

#event-banner-input {
    opacity: 0;
    position: absolute;
}

.event-options-label {
    flex-basis: 30%;
}

#event-description,
#event-location,
#event-name {
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    padding-left: 15px;
    resize: none;
    border: none;
    outline: none;
}

#event-description {
    height: 120px !important;
}

#event-date-container {
    display: flex;
    width: 80%;
    column-gap: 10px;
}

.event-date-time-picker {
    text-align: start;
    width: 300px !important;
}

#date-title {
    text-align: start;
    place-self: center;
    width: 10px;
}

.pcr-button {
    width: 50px !important;
    height: 50px !important;
    margin-left: 20%;
}

.pcr-interaction input {
    width: 100% !important;
}

.color-result {
    width: 170px;
    height: 40px;
    border-radius: 10px;
    border: none;
    font-size: 1.2em;
    text-align: center;
    place-self: center;
    margin-left: 20px;
}

#event-form-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 30px;
}
</style>
