<template>
    <div id="forum-form-overlay">
        <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" v-if="submitting || (editMode && !dataInitialized)" />
    
        <!-- form -->
        <form id="forum-form-container" @submit.prevent="submitForm">
            <!-- button to close forum form -->
            <button id="close-form" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>
    
            <h1 id="form-header">{{ editMode ? 'Edit Forum' : 'Create New Forum' }}</h1>
    
            <!-- Upload forum pic -->
            <div id="forum-pic-container">
                <label for="forum-pic-input" id="forum-pic-label"><u>Click</u> to Select Forum Picture:</label>
                
                <span v-if="!groupPicObject && !selectedGroupPic" id="forum-pic-none">No image selected</span>
                <span v-if="groupPicObject && groupPicErrors.length > 0" class="errMsg">Invalid file</span>
                <img v-if="selectedGroupPic" :src="selectedGroupPic" alt="Group Picture"  id="forum-pic-picture" />
                <input id="forum-pic-input" type="file" @change="fileChanged" accept=".jpg, .jpeg, .png" />
    
                <!-- inform user about invalid file -->
                <div v-if="groupPicErrors.length > 0">
                    <span>Error:</span>
                    <br />
                    <span v-for="error in groupPicErrors" class="errMsg">{{ error }}</span>
                </div>
            </div>
            
            
            <!-- Upload banner -->     
            <div id="forum-banner-container">
                <label for="forum-banner-input" id="forum-banner-label"><u>Click</u> to Select Forum Banner:</label>
    
                <span v-if="!bannerObject && !selectedBanner" id="forum-banner-none">No image selected</span>
                <span v-if="bannerObject && bannerErrors.length > 0" class="errMsg">Invalid file</span>
                <img v-if="selectedBanner" :src="selectedBanner" alt="Banner"  id="forum-banner-picture" />
                <input id="forum-banner-input" type="file" @change="fileChanged" accept=".jpg, .jpeg, .png" />
                
                <!-- inform user about invalid file -->
                <div v-if="bannerErrors.length > 0">
                    <span>Error:</span>
                    <br />
                    <span v-for="error in bannerErrors" class="errMsg">{{ error }}</span>
                </div>
            </div>
            
            <!-- forum id input -->
            <div id="forum-id-container">
                <div class="forum-field-container">
                    <label for="forum-id-input" class="forum-label">ID: </label>
                    <input type="text" id="forum-id-input" v-model="forumID" placeholder="Unique Forum ID:" @input="debounceVerifyForumID" />
                </div>
    
                <span id="forum-id-available" v-if="!idErr && forumIDVerified && !illegalChar">Forum ID available.</span>
                <span class="errMsg" v-if="idErr && forumIDVerified && !illegalChar">Forum ID already taken.</span>
                <span class="errMsg" v-if="illegalChar" >Illegal chararcter detected</span>
            </div>
    
            <!-- forum name input -->
            <div class="forum-field-container">
                <label for="forum-name-input" class="forum-label">Name:</label>
                <input type="text" id="forum-name-input" v-model="forumName" placeholder="Forum Name" />
            </div>
            
            <!-- forum description input -->
            <div class="forum-field-container">
                <label for="forum-desc-input" class="forum-label">Description:</label>
                <textarea id="forum-desc-input" v-model="forumDesc" :maxlength="500" placeholder="Forum Description (optional)" ></textarea>
            </div>
            
            <!-- forum tags input -->
            <div class="forum-field-container">
                <label for="forum-tags-input" class="forum-label">Tags:</label>
                <div id="forum-tags-container">
                    <AddInterestButton :selectedOption="tags" @selectedInterests="handleForumTags">
                        Select Tags For Your Forum (Optional):
                    </AddInterestButton>
                </div>
            </div>
                
            <button class="forum-form-control-button" :disabled="submitting || !requiredFields">{{ submitting ? 'Submitting...' : 'Submit' }}</button>
        </form>
    </div>
</template>

<script>
import { useAlertStore } from '../../stores/AlertStore.js';
import LoadingOverlay from '../general/LoadingOverlay.vue';
import AddInterestButton from '../general/AddInterestButton.vue';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            alert: useAlertStore().alert,

            selectedBanner: null,
            bannerObject: null,
            selectedGroupPic: null,
            groupPicObject: null,
            forumID: '',
            forumName: '',
            forumDesc: '',
            tags: [],
            submitting: false,
            
            //Error handling
            idErr: false,
            forumIDVerified: false,
            debouncedVerifyForumID: null,
            groupPicErrors: [],
            bannerErrors: [],
            illegalChar: false,
            // for edit mode
            dataInitialized: false,
            pictureUpdated: false,
            bannerUpdated: false
        }
    },
    components: {
        LoadingOverlay,
        AddInterestButton
    },
    props: [
        'editMode',
        'forum'
    ],
    emits: [
        'close-forum-form'
    ],
    created() {
        // initialize data during edit mode
        if (this.editMode) {
            this.initData();
        }

        // set debounce function
        this.debouncedVerifyForumID = debounce(this.verifyForumID, 2000);
    },
    methods: {
        // handle selected tags
        handleForumTags(newTags) {
            this.tags = newTags;
        },
        // close forum form
        closeForm() {
            this.$emit('close-forum-form');
        },
        // verify if forum ID exists
        async verifyForumID(){
            if (this.forumID.trim() == '') {
                return;
            }
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/verify-forumID`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
                body: JSON.stringify({ forum_id: this.forumID.trim() })
            }).then((res) => {
                if (res.ok) {
                    this.idErr = false;
                }
                else if (res.status == 400) {
                    res.json().then(data => {
                        if (data.error == 'ForumID already exists') {
                            this.idErr = true;
                        }
                    })
                }

                this.forumIDVerified = true;
            });
        },
        // debounce verifyForumID
        debounceVerifyForumID() {
            this.forumIDVerified = false;
            if (this.checkForIllegalChar()){
                return this.illegalChar = true
            }
            this.illegalChar = false
            this.debouncedVerifyForumID()
        },
        // to handle change in selected files
        fileChanged(e) {
            // check if event is triggered by picture input
            const forPicture = e.target.id == 'forum-pic-input';

            // if no files selected then clear relevant fields and return
            if (e.target.files.length <= 0) {
                if (forPicture) {
                    this.groupPicObject = null;
                    this.selectedGroupPic = null;
                    this.groupPicErrors = [];
                }
                else {
                    this.bannerObject = null;
                    this.selectedBanner = null;
                    this.bannerErrors = [];
                }

                return;
            }

            if (this.editMode) {
                if (forPicture) {
                    this.pictureUpdated = true;
                }
                else {
                    this.bannerUpdated = true;
                }
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
            if (forPicture) {
                this.groupPicObject = e.target.files[0];
                this.groupPicErrors = errors;
                this.selectedGroupPic = null;
            }
            else {
                this.bannerObject = e.target.files[0];
                this.bannerErrors = errors;
                this.selectedBanner = null;
            }

            // return if there are errors
            if (errors.length > 0) {
                return;
            }

            // otherwise preview images
            if (forPicture) {
                this.selectedGroupPic = URL.createObjectURL(this.groupPicObject);
            }
            else {
                this.selectedBanner = URL.createObjectURL(this.bannerObject);
            }
        },
        checkForIllegalChar(){
            console.log('1')
            if (this.forumID.includes('#')){
                return true;
            }
            
            return false
        }, 
        // submit forum form
        async submitForm() {
            this.submitting = true;

            // if in edit mode, check if user changed any fields
            if (this.editMode) {
                // if user has not changed any fields then do nothing
                if (!this.fieldsChanged && !this.pictureUpdated && !this.bannerUpdated) {
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

            // add picture and banner only if they are updated in edit mode or if not in edit mode
            if ((this.editMode && this.pictureUpdated) || !this.editMode) {
                uploadData.append('selectedImages', this.groupPicObject);
            }

            if ((this.editMode && this.bannerUpdated) || !this.editMode) {
                uploadData.append('selectedImages', this.bannerObject);
            }

            // tell server picture or banner is unchanged if so
            if (this.editMode && !this.pictureUpdated) {
                uploadData.append('pictureUnchanged', true);
            }

            if (this.editMode && !this.bannerUpdated) {
                uploadData.append('bannerUnchanged', true);
            }
            
            try {
                if (this.forumID.includes("#")){
                    return;
                }
                var forumObject = {
                    'forum_name': this.forumName.trim(),
                    'forum_id': this.forumID.trim(),
                    'forum_desc': this.forumDesc.trim(),
                    'tags': this.tags
                }
                
                uploadData.append('forumObject', JSON.stringify(forumObject));
                
                // send request to server with data
                const targetURL = this.editMode ? `${import.meta.env.VITE_APP_SERVER_URL}/api/forums/${this.forum._id}` : `${import.meta.env.VITE_APP_SERVER_URL}/api/forums`;
                
                const options = {
                    mode: 'cors',
                    method: this.editMode ? 'PATCH' : 'POST',
                    body: uploadData,
                    credentials: 'include'
                };

                const successMessage = this.editMode ? 'Forum updated.' : 'Forum created.';

                await fetch(targetURL, options)
                    .then(async response => {
                        if (response.ok){
                            await this.alert(successMessage);

                            // if have forum object (from edit mode) immediately set forumID with current id
                            if (this.forum) {
                                sessionStorage.setItem('forum_id', this.forum._id);
                            }
                            // otherwise parse server response and set forum id
                            else {
                                await response.json().then(data => {
                                    sessionStorage.setItem('forum_id', data.forum_id);
                                    location.href = "/forumGroup.html";
                                });
                            }
                        } else {
                            console.log('An error occurred.');
                        };
                        
                        this.submitting = false
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
        async initData() {
            this.selectedGroupPic = this.forum.forum_pic_link;
            this.selectedBanner = this.forum.banner_link;
            this.forumID = this.forum.forum_id;
            this.forumIDVerified = true;
            this.forumName = this.forum.forum_name;
            this.forumDesc = this.forum.forum_desc || '';
            this.tags = [...this.forum.tags];

            this.dataInitialized = true;
        }
    },
    computed: {
        // check if required fields are all filled up
        requiredFields() {
            const nameValid = this.forumName.trim().length > 0;
            const idValid = this.forumID.trim().length > 0 && this.forumIDVerified && !this.idErr;
            let picValid = this.selectedGroupPic && this.groupPicObject;
            let bannerValid = this.selectedBanner && this.bannerObject;

            // if in edit mode, set picValid and bannerValid to true if no changes are made
            if (this.editMode) {
                picValid = picValid ? picValid : !this.pictureUpdated && this.selectedGroupPic;
                bannerValid = bannerValid ? bannerValid : !this.bannerUpdated && this.selectedBanner;
            }

            return nameValid && idValid && picValid && bannerValid;
        },
        // to check if any fields are changed
        fieldsChanged() {
            const nameSame = this.forumName == this.forum.forum_name;
            const idSame = this.forumID == this.forum.forum_id;
            const tagSame = this.tags == this.forum.tags;
            const descSame = this.forumDesc == this.forum.forum_desc;

            return !(nameSame && idSame && tagSame && descSame);
        }
    }
}
</script>

<style scoped>
@import url('../../styles/main.css');

#forum-form-overlay {
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

#forum-form-container {
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

#forum-pic-container, #forum-banner-container {
    display: flex;
    row-gap: 20px;
    flex-direction: column;
    color: white;
    align-items: center;
    width: 100%;
}

#forum-pic-label, #forum-banner-label {
    font-size: 1.2em;
    cursor: pointer;
}

#forum-pic-none, #forum-pic-picture {
    height: 150px;
    width: 150px;
    background-color: white;
    border-radius: 50%;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

#forum-banner-none, #forum-banner-picture {
    width: 60%;
    height: 300px;
    background-color: white;
    border-radius: 20px;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
}

#forum-pic-picture, #forum-banner-picture {
    object-fit: cover;
    object-position: center;
}

#forum-pic-input, #forum-banner-input {
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
}

.forum-label {
    color: white;
    flex-basis: 30%;
}

.errMsg{
    color: red;
    font-weight: bold;
    margin-bottom: 0;
}

#forum-id-available {
    color: lightgreen;
    font-weight: bold;
    margin-bottom: 0;
}

#forum-id-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
}

.forum-field-container {
    display: flex;
    flex-direction: row;
    width: 60%;
    justify-content: start;
    align-items: center;
    text-align: start;
}

#forum-id-input, #forum-name-input, #forum-desc-input, #forum-tags-container {
    width: 100%;
}

#forum-id-input, #forum-name-input, #forum-desc-input {
    padding: 10px;
    border-radius: 10px;
    resize: none;
    outline: none;
    border: none;
}

.forum-form-control-button {
    background-color: #E53A73;
    border: none;
    border-radius: 10px;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
}

.forum-form-control-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>