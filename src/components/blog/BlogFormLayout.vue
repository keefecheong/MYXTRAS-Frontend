<template>
    <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" v-if="isSubmitting || (editMode && !isDataInitialized)" />

    <!-- form to upload images -->
    <form id="blog-form" @submit.prevent="submitForm">
        <button id="close-form" @click="closeForm" type="button">
            <span class="material-symbols-outlined">Close</span>
        </button>
        
        <h1 class="form-header">{{ editMode ? 'Edit Post' : 'Create New Post' }}</h1>
        
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
                <span>Selected ({{ files.length }}):</span>
                <ul>
                    <li v-for="(file, index) in files" :class="{invalidFile: invalidFiles.includes(index)}">{{ file.name }} - {{ calculateSize(file.size) }}</li>
                </ul>
            </div>

            <!-- preview images if there are files selected with no errors -->
            <div v-if="files.length > 0 && errors.length == 0">
                <span>Selected ({{ files.length }}):</span>
                <div v-for="(link, index) in selectedLinks" class="preview-image-container">
                    <img :src="link" />
                    <span>{{ files[index].name }} ({{ calculateSize(files[index].size) }})</span>
                </div>
            </div>
        </div>

        <!-- input for blog caption -->
        <div class="image-options-container">
            <label for="image-caption" id="caption-title" class="image-options-label">Caption:</label>
            <textarea id="image-caption" name="image-caption" placeholder="Provide a caption (Optional)" v-model="caption"></textarea>
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
                <AdditionButton :tags="selectedOption"/>

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
            <input class="image-form-control-button" type="reset" value="Clear All" @click="resetAll" />
            <!-- 
                disable submit button if 
                1. there are no files selected
                2. there are files selected but contains errors
            -->
            <input class="image-form-control-button" type="submit" :value="submitting ? 'Loading...' : 'Submit'" :disabled="files.length == 0 || (files.length > 0 && errors.length > 0) || submitting" />
        </div>
    </form>
</template>

<script>
import AdditionButton from '../../components/profile/AdditionButton.vue';
import { useBlogStore } from '../../stores/BlogStore';
import calculateSize from '../../utils/general/formatFileSize.js';
import LoadingOverlay from '../general/LoadingOverlay.vue';

export default {
    components: {
        AdditionButton,
        LoadingOverlay
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

            // for edit mode
            blog: {},
            dataInitialized: false,
            toInitFiles: true,
            dataTransfer: new DataTransfer(),
            fileUpdated: false,
            store: useBlogStore()
        }
    },
    props: [
        'editMode',
        'windowLocation'
    ],
    emits: [
        'close-image-form'
    ],
    created() {
        // initialize data during edit mode
        if (this.editMode) {
            this.initData();
        }
    },
    mounted() {
        // check if need to init files of file input during edit mode
        // if true then set the existing files and set toInitFiles to false
        if (this.editMode && this.toInitFiles) {
            document.getElementById('upload-image').files = this.dataTransfer.files;

            this.toInitFiles = false;
        }
    },
    methods: {
        // to close the form
        closeForm() {
            this.$emit('close-image-form');
        },
        // to handle form submission
        async submitForm() {
            this.submitting = true;

            // if in edit mode, check if user changed any fields
            if (this.editMode) {
                console.log(this.caption)
                console.log(this.blog.caption)
                console.log(this.location)
                console.log(this.blog.location)
                console.log(this.commentsEnabled)
                console.log(this.blog.comments_enabled)
                let fieldsChanged = false;
                const captionSame = this.caption == (this.blog.caption || '');
                const locationSame = this.location == (this.blog.location || '');
                const commentsEnabledSame = this.commentsEnabled == this.blog.comments_enabled;

                console.log(captionSame)
                console.log(locationSame)
                console.log(commentsEnabledSame)

                if (!(captionSame && locationSame && commentsEnabledSame)) {
                    fieldsChanged = true;
                }

                console.log(fieldsChanged)
                console.log(this.fileUpdated)

                // if user did not change any fields or files selected then do nothing
                if (!fieldsChanged && !this.fileUpdated) {
                    this.submitting = false;

                    alert('No changes made.');

                    return;
                }
            }

            // check if the user has uploaded any files
            if (this.files.length <= 0) {
                this.submitting = false;

                alert('No files selected.');

                return;
            }

            // checks if there are any errors
            if (this.errors.length > 0) {
                this.submitting = false;

                alert('Invalid files selected.');
                
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

            formData.append('caption', this.caption);
            formData.append('location', this.location);
            formData.append('commentsEnabled', this.commentsEnabled);

            // send request to backend server with data
            const options = {
                mode: 'cors',
                method: 'POST',
                body: formData,
                credentials: 'include'
            };

            if (this.editMode) {
                options.method = 'PATCH';
            }

            const targetURL = this.editMode ? `${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}` : `${import.meta.env.VITE_APP_SERVER_URL}/api/posts`;

            await fetch(targetURL, options)
                .then((res) => {
                    this.submitting = false;
                    
                    // reset and close form
                    this.resetAll();
                    this.closeForm();

                    res.json().then((data) => {
                        alert(data.message);

                        // return to original location if from edit mode
                        if (this.editMode) {
                            location.href = this.windowLocation;
                        }
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
            // get blog data
            this.blog = this.store.blogToEdit;

            // set links
            this.selectedLinks = this.blog.content_links;

            await this.downloadExistingImages();
            
            // update other attributes of the blog
            if (this.blog.caption) {
                this.caption = this.blog.caption;
            }

            if (this.blog.location) {
                this.location = this.blog.location;
            }

            this.commentsEnabled = this.blog.comments_enabled;

            this.dataInitialized = true;
        },
        // download images and save as files
        async downloadExistingImages() {
            const imagePromises = this.selectedLinks.map((link, index) => {
                return fetch(link).then(async (res) => {
                    if (res.status == 200) {
                        await res.blob().then((blob) => {
                            const imageName = `${this.blog.original_names[index]}`;
                            const image = new File([blob], imageName, {
                                type: blob.type
                            });

                            this.files.push(image);
                            this.dataTransfer.items.add(image);
                        });
                    }
                    else {
                        console.log('Failed to retrieve image.');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            });

            await Promise.all(imagePromises).catch((error) => {
                console.log(error);
            });
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
        }
    }
}
</script>

<style>
#custom-btn {
    width: fit-content !important;
    height: fit-content !important;
    margin-left: 0 !important;
    margin-top: 5px !important;
}

.form-header {
    align-items: center;
    margin-bottom: 1rem;
}

#close-form {
    background-color: transparent;
    border: none;
    outline: none;
    position: absolute;
    right: 20px;
    top: 20px;
}

#blog-form {
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    background-color: #133B5B;
    color: white;
    width: 35%;
    max-height: 90%;
    position: relative;
    overflow: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 20px;
}

#upload-image-container {
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    padding: 10px;
    width: 80% !important;
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
    border-radius: 10px;
    padding: 15px;
    font-size: 14px;
    resize: none;
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

.image-form-control-button {
    background-color: #E53A73;
    border: none;
    border-radius: 10px;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
}

.image-form-control-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>