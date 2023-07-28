<template>
    <div class="form-overlay">
        <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" v-if="isSubmitting || (editMode && !isDataInitialized)" />

        <!-- form to upload images -->
        <form class="form-overlay-content" @submit.prevent="submitForm">
            <button class="form-overlay-close" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>
            
            <h1>{{ editMode ? 'Edit Post' : 'Create New Post' }}</h1>
            
            <div id="upload-image-container">
                <!-- input to select images -->
                <input type="file" id="upload-image" multiple @change="fileChanged" accept=".jpg, .jpeg, .png" />
                <label for="upload-image" id="upload-image-label">
                    <p>Drag and drop 
                        <br>
                        or
                        <br> 
                        click <u>here</u> to upload.
                    </p>
                </label>

                <!-- display errors -->
                <div id="upload-image-errors" v-if="files.length > 0 && errors.length > 0">
                    <span>Error{{ errors.length > 1 ? 's' : '' }}:</span>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </div>

                <!-- display selected file names if there are errors -->
                <div id="selected-image-names" v-if="files.length > 0 && invalidFiles.length > 0">
                    <span>Selected ({{ selectedFileCount }}):</span>
                    <ul>
                        <li v-for="(file, index) in files" :class="{invalidFile: invalidFiles.includes(index)}">{{ file.name }} - {{ calculateSize(file.size) }}</li>
                    </ul>
                </div>

                <!-- preview images if there are files selected with no errors -->
                <div v-if="selectedLinks.length > 0 && errors.length == 0">
                    <span>Selected ({{ selectedFileCount }}):</span>
                    <div v-for="(link, index) in selectedLinks" class="preview-image-container">
                        <img :src="link" />
                        <span class="hide-overflow-text">{{ this.editMode && !this.fileUpdated ? blog.original_names[index] : files[index].name }}</span>
                        <!-- show size only if new files are uploaded -->
                        <span v-if="files[index]">({{ calculateSize(files[index].size) }})</span>
                    </div>
                </div>
            </div>

            <!-- input for blog caption -->
            <div class="image-options-container">
                <label for="image-caption" id="caption-title" class="image-options-label">Caption:</label>
                <DynamicTextarea :id="'image-caption'" :placeholder="'Provide a caption (Optional)'" v-model="caption" />
            </div>
            
            <!-- input for blog location -->
            <div class="image-options-container">
                <label for="image-location" id="location-title" class="image-options-label">Location:</label>
                <input type="text" id="image-location" name="image-location" placeholder="Location (Optional)" v-model="location"/>
            </div>
            
            <!-- input for blog interest tags -->
            <div class="image-options-container">
                <label for="image-tags" id="tags-title" class="image-options-label">Tags:</label>
                <div id="image-tags-selection">
                    <AddInterestButton :selectedOption="tags" @selectedInterests="handlePostTags">
                        Select Tags For Your Post (Optional):
                    </AddInterestButton>
                </div>
            </div>

            <!-- input for blog comments enabled option -->
            <div class="image-options-container">
                <span id="comments-title" class="image-options-label">Turn on comments:</span>
                <div id="image-comments-options">
                    <div id="image-comments-checkbox-container">
                        <input type="checkbox" class="checkbox" id="image-comments-checkbox" v-model="commentsEnabled" />
                        <label class="switch" for="image-comments-checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div id="image-form-controls">
                <input class="form-overlay-control-button" type="reset" value="Clear All" @click="resetAll" />
                <!-- 
                    disable submit button if 
                    1. not in edit mode and no files are selected
                    2. files are selected but there are errors
                    3. in edit mode and no fields are changed and no files are changed
                    4. submit in progress
                -->
                <input class="form-overlay-control-button" type="submit" :value="submitting ? 'Loading...' : 'Submit'" 
                    :disabled="(!editMode && files.length <= 0) || (files.length > 0 && errors.length > 0) || (editMode && !fieldsChanged && !fileUpdated) || submitting" />
            </div>
        </form>
    </div>
</template>

<script>
import AddInterestButton from '../general/AddInterestButton.vue';
import calculateSize from '../../utils/general/formatFileSize.js';
import LoadingOverlay from '../general/LoadingOverlay.vue';
import { useAlertStore } from '../../stores/AlertStore.js';
import DynamicTextarea from '../general/DynamicTextarea.vue';

export default {
    components: {
        AddInterestButton,
        LoadingOverlay,
        DynamicTextarea
    },
    data() {
        return {
            files: [],
            errors: [],
            selectedLinks: [],
            invalidFiles: [],
            caption: '',
            location: '',
            tags: [],
            commentsEnabled: true,
            submitting: false,
            alert: useAlertStore().alert,

            // for edit mode
            dataInitialized: false,
            toInitFiles: true,
            dataTransfer: new DataTransfer(),
            fileUpdated: false
        }
    },
    props: [
        'editMode',
        'blog'
    ],
    emits: [
        'close-blog-form'
    ],
    created() {
        // initialize data during edit mode
        if (this.editMode) {
            this.initData();
        }
    },
    methods: {
        // to close the form
        closeForm() {
            this.$emit('close-blog-form');
        },
        // to handle form submission
        async submitForm() {
            this.submitting = true;

            // if in edit mode, check if user changed any fields
            if (this.editMode) {
                // if user did not change any fields or files selected then do nothing
                if (!this.fieldsChanged && !this.fileUpdated) {
                    this.submitting = false;

                    await this.alert('No changes made.');

                    return;
                }
            }

            // check if the user has uploaded any files
            if (this.files.length <= 0 && !this.editMode) {
                this.submitting = false;

                await this.alert('No files selected.');

                return;
            }

            // checks if there are any errors
            if (this.errors.length > 0) {
                this.submitting = false;

                await this.alert('Invalid files selected.');
                
                return;
            }

            var formData = new FormData();

            // if in edit mode, only add images if user changed the files
            if ((this.editMode && this.fileUpdated) || !this.editMode) {
                // add images to formData
                for (let i = 0; i < this.files.length; i++) {
                    formData.append('selectedImages', this.files[i]);
                }
            }

            // if in edit mode and user did not change files add in formData to tell server
            if (this.editMode && !this.fileUpdated) {
                formData.append('noFilesChanged', true);
            }

            // add other fields' data to formData
            formData.append('caption', this.caption);
            formData.append('location', this.location);
            formData.append('commentsEnabled', this.commentsEnabled);

            for (let i = 0; i < this.tags.length; i++) {
                formData.append('tags', this.tags[i]);
            }

            // send request to backend server with data
            const options = {
                mode: 'cors',
                method: this.editMode ? 'PATCH' : 'POST',
                body: formData,
                credentials: 'include'
            };

            const baseURL = `${import.meta.env.VITE_APP_SERVER_URL}/api/posts`;
            const targetURL = this.editMode ? `${baseURL}/user/${this.blog.creator_id._id}/post/${this.blog._id}` : baseURL;

            await fetch(targetURL, options)
                .then(async (res) => {
                    this.submitting = false;

                    await res.json().then(async (data) => {
                        await this.alert(data.message);
                    
                        // reset and close form
                        this.resetAll();
                        this.closeForm();

                        location.reload();
                    });
                }).catch((error) => {
                    console.log(error);
                });
        },
        // to handle change in selected files
        fileChanged(e) {
            if (this.editMode) {
                this.fileUpdated = true;
            }

            // set files
            this.files = e.target.files;
            // clear errors, invalidFiles and selectedLinks
            this.errors = [];
            this.invalidFiles = [];
            this.selectedLinks = [];

            // valid conditions
            const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxImageSize = 2 * 1024 * 1024;
            const maxImageCount = 10;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(', ')}`;
            const largeFile = `File is too large, maximum file size is ${maxImageSize / 1024 / 1024}MB.`;
            const exceedFileCount = `File limit reached, up to ${maxImageCount} files are allowed.`;

            // check for too many images, large images, and invalid file types
            if (e.target.files.length > maxImageCount) {
                this.errors.push(exceedFileCount);
            }

            for (let i = 0; i < e.target.files.length; i++) {
                const currentImage = e.target.files[i];

                if (currentImage.size > maxImageSize) {
                    this.errors.push(largeFile);
                    this.invalidFiles.push(i);
                }

                if (!acceptedFileTypes.includes(currentImage.type)) {
                    this.errors.push(illegalFileType);
                    this.invalidFiles.push(i);
                }
            }

            // return if there are errors
            if (this.errors.length > 0) {
                return;
            }

            // otherwise preview images
            for (let i = 0; i < this.files.length; i++) {
                this.selectedLinks.push(URL.createObjectURL(this.files[i]));
            }
        },
        // to clear files and errors on reset
        resetAll() {
            this.files = [];
            this.errors = [];
            this.selectedLinks = [];
            this.invalidFiles = [];
            this.caption = '';
            this.location = '';
            this.tags = [];
            this.commentsEnabled = true;
        },
        // to format size of file for display
        calculateSize(bytes) {
            return calculateSize(bytes);
        },
        // initialize data
        async initData() {
            this.selectedLinks = this.blog.content_links;
            
            this.caption = this.blog.caption || '';

            this.location = this.blog.location || '';

            this.commentsEnabled = this.blog.comments_enabled;

            this.tags = [...this.blog.tags];

            this.dataInitialized = true;
        },
        // handle selection of interest tags
        handlePostTags(newTags) {
            this.tags = newTags;
        }
    },
    computed: {
        // check if form is submitting
        isSubmitting() {
            return this.submitting;
        },
        // check if data is initialized
        isDataInitialized() {
            return this.dataInitialized;
        },
        // get selected files count
        selectedFileCount() {
            return Math.max(this.files.length, this.selectedLinks.length);
        },
        // check if fields are changed for edit mode
        fieldsChanged() {
            const captionSame = this.caption == (this.blog.caption || '');
            const locationSame = this.location == (this.blog.location || '');
            const commentsEnabledSame = this.commentsEnabled == this.blog.comments_enabled;
            const tagsSame = this.tags.toString() == this.blog.tags.toString();

            return !(captionSame && locationSame && commentsEnabledSame && tagsSame);
        }
    }
}
</script>

<style>
@import url('../../styles/forms/form-overlay-styles.css');

#upload-image-container {
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    padding: 10px;
    width: 80%;
    height: fit-content;
    display: grid;
    row-gap: 10px;
    align-items: center;
    background-color: white;
    color: black;
}

#upload-image {
    opacity: 0;
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
}

#upload-image-label {
    width: fit-content;
    height: fit-content;
    margin: auto;
    cursor: pointer;
}

#upload-image-errors, .invalidFile {
    color: red;
    font-style: italic;
}

#upload-image-container ul {
    list-style-type: none;
    padding: 0;
}

.image-options-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    justify-content:start;
    align-items: center;
    width: 80%;
    text-align: start;
}

.image-options-label {
    flex-basis: 30%;
}

#image-caption, #image-location, #image-tags-selection, #image-comments-options {
    width: 100%;
}

#image-caption, #image-location {
    border-radius: 10px;
    padding: 10px;
    resize: none;
    border: none;
    outline: none;
}

#interest-badges {
    width: fit-content;
}

/* The switch - the box around the slider */
#image-comments-checkbox-container {
    width: 4em;
    height: 2em;
    padding: 0;
    position: relative;
    font-size: 0.8em;
}

/* Hide default HTML checkbox */
#image-comments-checkbox {
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
}

.switch {
    width: 100%;
    height: 100%;
    background-color: lightgray;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease-out;
}

/* The slider */
.slider {
    width: 2em;
    height: 2em;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-out;
    cursor: pointer;
}

.checkbox:checked + .switch {
    background-color: #34C759;
}

.checkbox:checked + .switch .slider {
    left: 2em;
    top: 0;
}

.preview-image-container {
    margin: 0 auto;
    margin-bottom: 12px;
    border-style: dotted;
    border-width: 1px;
    border-color: black;
    border-radius: 10px;
    width: 80%;
    padding: 10px;
    height: fit-content;
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    justify-content: center;
    max-width: 25vw;
}

.preview-image-container img {
    width: 150px;
    height: 100px;
    object-fit: cover;
}

.preview-image-container span {
    overflow-wrap: break-word;
}

#image-form-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 30px;
}
</style>