<template>
    <div class="form-overlay">
        <form class="form-overlay-content" @submit.prevent="submitForm">
            <button class="form-overlay-close" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>

            <h1>{{ editMode ? 'Edit Event' : 'Create New Event' }}</h1>

            <!-- Upload banner -->     
            <div id="event-banner-container">
                <label for="event-banner-input" v-if="!bannerObject && !selectedBanner" id="event-banner-none">No image selected</label>
                <span v-if="bannerObject && bannerErrors.length > 0" class="errMsg">Invalid file</span>
                <img v-if="selectedBanner" :src="selectedBanner" alt="Banner"  id="event-banner-picture" />
                <input id="event-banner-input" type="file" @change="fileChanged" accept=".jpg, .jpeg, .png" />

                <label for="event-banner-input" id="event-banner-label"><u>Click</u> to Select Event Banner:</label>
                
                <!-- inform user about invalid file -->
                <div v-if="bannerErrors.length > 0">
                    <span>Error:</span>
                    <br />
                    <p v-for="error in bannerErrors" class="errMsg">{{ error }}</p>
                </div>
            </div>

            <!-- input for event name -->
            <div class="event-options-container">
                <label for="event-name" id="name-title" class="event-options-label">Event Title:</label>
                <input type="text" id="event-name" name="event-name" placeholder="Max 50 Character" v-model="name" maxlength="50"/>
            </div>

            <!-- input for event description -->
            <div class="event-options-container">
                <label for="event-description" id="description-title" class="event-options-label">Description:</label>
                <DynamicTextarea :id="'event-description'" :placeholder="'Description of the event'" v-model="description" />
            </div>

            <!-- input for event location -->
            <div class="event-options-container">
                <label for="event-location" id="location-title" class="event-options-label">Location:</label>
                <input type="text" id="event-location" name="event-location" placeholder="Location" v-model="location" maxlength="200"/>
            </div>

            <div id="event-date-container">
                <label for="event-date-time" id="date-title" class="event-options-label">Date & Time:</label>
                <div class="event-date-time-picker">
                    <VueCtkDateTimePicker 
                    v-model="selectedDateTime" 
                    :format="'DD-MM-YYYY HH:mm'"
                    :firstDayOfWeek="1"
                    
                    />
                </div>
                <div class="color-picker"></div>
                <input class="color-result" type="text" placeholder="Color Hex Value" maxlength="7">
            </div>

            <div id="event-form-controls">
                <input class="form-overlay-control-button" type="reset" value="Clear All" @click="resetAll" />
                <!-- 
                    disable submit button if 
                    1. not in edit mode and no files are selected
                    2. files are selected but there are errors
                    3. in edit mode and no fields are changed and no files are changed
                    4. submit in progress
                -->
                <input class="form-overlay-control-button" type="submit" :value="submitting ? 'Loading...' : 'Submit'" 
                    :disabled="(!editMode)" />
            </div>
        </form>
    </div>
</template>

<script>
import DynamicTextarea from '../../general/DynamicTextarea.vue';
import { useAlertStore } from '../../../stores/AlertStore.js';
import Pickr from '@simonwep/pickr';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

export default {
    components: {
        DynamicTextarea,
        VueCtkDateTimePicker
    },
    data() {
        return {
            bannerObject: null,
            bannerErrors: [],
            selectedBanner: null,
            invalidFiles: '',
            description: '',
            location: '',
            title: '',
            date: '',
            time: '',
            color: '',
            submitting: false,
            alert: useAlertStore().alert,
            pickr: null,
            bannerUpdated: false,
            selectedDateTime: '2023-08-07 00:05'
        }
    },
    props: [
        'editMode',
        'event'
    ],
    emits: [
        'close-event-form'
    ],
    mounted() {
        this.initColorPicker();
    },
    methods: {
        // to close the form
        closeForm() {
            this.$emit('close-event-form');
        },
        // to handle form submission
        async submitForm() {
            return
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
            const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(', ')}`;
            const largeFile = `File is too large, maximum file size is ${maxImageSize / 1024 / 1024}MB.`;

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
            this.invalidFiles = '';
            this.description = '';
            this.location = '';
            this.title = '';
            this.date = '';
            this.time = '';
        },
        initColorPicker() {
            // Simple example, see optional options for more configuration.
            this.pickr = Pickr.create({
                el: '.color-picker',
                theme: 'monolith', // 'classic' or 'monolith', or 'nano'
                default: '#FF6363',
                padding: 10,
                lockOpacity: false,

                swatches: [
                    '#F44336',
                    '#E91E63',
                    '#9C27B0',
                    '#673AB7',
                    '#3F51B5',
                    '#2196F3',
                    '#03A9F4',
                    '#00BCD4',
                    '#009688',
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39',
                    '#FFEB3B',
                    '#FFC107'
                ],

                components: {

                    // Main components
                    preview: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        input: true,
                        clear: true,
                        save: true
                    }
                }
            });
            this.pickr.on('save', (color, instance) => {
                this.color = color.toHEXA().toString();
                document.querySelector('.color-result').value = this.color;
            })
        },
    }
}

</script>

<style>
@import url('../../../styles/forms/form-overlay-styles.css');

.event-options-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    justify-content:start;
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

#event-banner-none, #event-banner-picture {
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

#event-description, #event-location, #event-name{
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

.pcr-interaction input{
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