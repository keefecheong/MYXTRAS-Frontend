<template>
    <div id="thread-form-overlay">
        <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" v-if="submitting || (editMode && !dataInitialized)" />
    
        <!-- form -->
        <form id="thread-form-container" @submit.prevent="submitForm">
            <!-- button to close thread form -->
            <button id="close-form" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>
    
            <h1 id="form-header">{{ editMode ? 'Edit Thread' : 'Create New Thread' }}</h1>
            
            <!-- thread title input -->
            <div id="thread-title-container">
                <div class="thread-field-container">
                    <label for="thread-title-input" class="thread-label">Title:</label>
                    <input type="text" id="thread-title-input" v-model="threadTitle" placeholder="Thread title" />
                </div>
            </div>
    
            <!-- thread description (content) input -->
            <div class="thread-field-container">
                <label for="thread-content-input" class="thread-label">Content:</label>
                <textarea id="thread-content-input" v-model="threadContent" :maxlength="500" placeholder="Thread content"></textarea>
            </div>
            
            <!-- thread tags input -->
            <div class="thread-field-container">
                <label for="thread-tags-input" class="thread-label">Tags:</label>
                <div id="thread-tags-container">
                    <AddInterestButton :selectedOption="tags" @selectedInterests="handleThreadTags">
                        Select Tags For Your Thread (Optional):
                    </AddInterestButton>
                </div>
            </div>

            <!-- Upload picture -->
            <div id="thread-picture-container">
                <label for="thread-picture-input" id="thread-picture-label"><u>Click</u> to Select Picture (Optional)</label>
    
                <span v-if="selectedImageObject && pictureErrors.length > 0" class="errMsg">Invalid file</span>

                <img v-if="selectedImageLink" :src="selectedImageLink" alt="Banner"  id="thread-picture" />
                <input id="thread-picture-input" type="file" @change="fileChanged" accept=".jpg, .jpeg, .png" />
                
                <!-- inform user about invalid file -->
                <div v-if="pictureErrors.length > 0">
                    <span>Error:</span>
                    <br />
                    <span v-for="error in pictureErrors" class="errMsg">{{ error }}</span>
                </div>
            </div>
                
            <button class="thread-form-control-button" :disabled="submitting || !requiredFields">{{ submitting ? 'Submitting...' : 'Submit' }}</button>
        </form>
    </div>
</template>

<script>
import { useAlertStore } from '../../stores/AlertStore.js';
import LoadingOverlay from '../general/LoadingOverlay.vue';
import AddInterestButton from '../general/AddInterestButton.vue';

export default {
    data() {
        return {
            alert: useAlertStore().alert,

            selectedImageLink: null,
            selectedImageObject: null,
            threadTitle: '',
            threadContent: '',
            tags: [],
            submitting: false,
            
            //Error handling
            pictureErrors: [],

            // for edit mode
            dataInitialized: false,
            pictureUpdated: false
        }
    },
    components: {
        LoadingOverlay,
        AddInterestButton
    },
    props: [
        'editMode',
        'thread',
        'forumID'
    ],
    emits: [
        'close-thread-form'
    ],
    created() {
        // initialize data during edit mode
        if (this.editMode) {
            this.initData();
        }
    },
    methods: {
        // handle selected interests
        handleThreadTags(newTags) {
            this.tags = newTags;
        },
        // close thread form
        closeForm() {
            this.$emit('close-thread-form');
        },
        // to handle change in selected files
        fileChanged(e) {
            // if no files selected then clear relevant fields and return
            if (e.target.files.length <= 0) {
                this.selectedImageObject = null;
                this.selectedImageLink = null;
                this.pictureErrors = [];

                return;
            }

            if (this.editMode) {
                this.pictureUpdated = true;
            }

            // valid conditions
            const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(', ')}`;
            const largeFile = `File is too large, maximum file size is ${maxImageSize / 1024 / 1024}MB.`;

            // set relevant fields
            this.selectedImageObject = e.target.files[0];
            this.selectedImageLink = null;

            // check for errors
            if (this.selectedImageObject.size > maxImageSize) {
                this.pictureErrors.push(largeFile);
            }

            if (!acceptedFileTypes.includes(this.selectedImageObject.type)) {
                this.pictureErrors.push(illegalFileType);
            }

            // return if there are errors
            if (this.pictureErrors.length > 0) {
                return;
            }

            // otherwise preview images
            this.selectedImageLink = URL.createObjectURL(this.selectedImageObject);
        },
        // submit forum form
        async submitForm() {
            this.submitting = true;

            // if in edit mode, check if user changed any fields
            if (this.editMode) {
                // if user has not changed any fields then do nothing
                if (!this.fieldsChanged && !this.pictureUpdated) {
                    await this.alert('No changes made.');
                    this.submitting = false;
                    return;
                }
            }

            // do nothing if required fields are not filled up
            if (!this.requiredFields) {
                await this.alert('Please fill up all required fields.');

                this.submitting = false;
                return;
            }

            const uploadData = new FormData();

            // add picture only if they are updated in edit mode or if not in edit mode and user uploaded a picture
            if ((this.editMode && this.pictureUpdated) || (!this.editMode && this.selectedImageLink != null)) {
                uploadData.append('picture', this.selectedImageObject);
            }

            // if in edit mode, tell server picture is unchanged if so
            if (this.editMode && !this.pictureUpdated) {
                uploadData.append('pictureUnchanged', true);
            }
            
            try {
                let threadObject = {
                    'title': this.threadTitle,
                    'content': this.threadContent,
                    'tags': this.tags
                }
                
                uploadData.append('threadObject', JSON.stringify(threadObject));
                
                // send request to server with data
                const targetURL = `${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/${this.forumID}`;
                
                const options = {
                    mode: 'cors',
                    method: this.editMode ? 'PATCH' : 'POST',
                    body: uploadData,
                    credentials: 'include'
                };

                const successMessage = this.editMode ? 'Thread updated.' : 'Thread created.';

                await fetch(targetURL, options)
                    .then(async response => {
                        if (response.ok){
                            await this.alert(successMessage);

                            sessionStorage.setItem('forum_id', this.forumID || this.thread.parent_id);
                            location.href = "/forumGroup.html";
                        } else {
                            console.log('An error occurred.');
                        };
                        
                        this.submitting = false;
                        return;
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } catch (error) {
                console.error('Error:', error);
            }
        },
        // initialize data
        initData() {
            this.selectedImageLink = this.thread.content_link || null;
            this.threadTitle = this.thread.title;
            this.threadContent = this.thread.content;
            this.tags = [...this.thread.tags];

            this.dataInitialized = true;
        }
    },
    computed: {
        // check if required fields are all filled up
        requiredFields() {
            const titleValid = this.threadTitle.trim().length > 0;
            const descValid = this.threadContent.trim().length > 0;

            return titleValid && descValid;
        },
        // to check if any fields are changed
        fieldsChanged() {
            const titleSame = this.threadTitle == this.thread.title;
            const descSame = this.threadContent == this.thread.content;
            const tagSame = this.tags == this.thread.tags;

            return !(titleSame && descSame && tagSame);
        }
    }
}
</script>

<style scoped>
@import url('../../styles/main.css');

#thread-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
}

#thread-form-container {
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    background-color: #133B5B;
    width: 60%;
    max-width: 80%;
    max-height: 90%;
    position: relative;
    overflow: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 30px;
    margin: 0 auto;
}

#form-header {
    margin: 0;
    color: white;
}

#close-form {
    background-color: transparent;
    color: white;
    border: none;
    outline: none;
    position: absolute;
    right: 20px;
    top: 20px;
}

#thread-picture-container {
    display: flex;
    row-gap: 20px;
    flex-direction: column;
    color: white;
    align-items: center;
    width: 60%;
}

#thread-picture-label {
    font-size: 1.2em;
    cursor: pointer;
}

#forum-pic-picture, #thread-picture {
    max-width: 100%;
    object-fit: cover;
    object-position: center;
}

#thread-picture-input {
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
}

.thread-label {
    color: white;
    flex-basis: 30%;
}

.errMsg{
    color: red;
    font-weight: bold;
    margin-bottom: 0;
}

#thread-title-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
}

.thread-field-container {
    display: flex;
    flex-direction: row;
    width: 60%;
    justify-content: start;
    align-items: center;
    text-align: start;
}

#thread-title-input, #thread-content-input, #thread-tags-container {
    width: 100%;
}

#thread-title-input, #thread-content-input {
    padding: 10px;
    border-radius: 10px;
    resize: none;
    outline: none;
    border: none;
}

.thread-form-control-button {
    background-color: #E53A73;
    border: none;
    border-radius: 10px;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
}

.thread-form-control-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>