<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="forums" :showPopUp="showPopUp" @show-popup="handleVariableUpdate"/>
            <br>
            <h1 id="forumHeader">Latest Updates!</h1>
            <div class="row">
                <div class="col-md-3">
                   <CreatedForums />
                   <SubscribedForums v-on:subbedForums="retrieveRecentThreads"/>
                </div>
            
                <div class="col-md-6">
                    <div class="row">
                        <div class="card shadow" v-if="subbedForums.length === 0">
                            <div class="center-align" style="margin: 3vh 0;">
                                <p>No new threads, go <a href="/explore.html">Xplore</a> for more!</p>
                            </div>
                        </div>
                        <ForumLayout :subbedForums="subbedForums" style="margin: 3vh 0;"/>
                    </div>
                </div>

                <div class="col-md-3">
                    <PopularThreads/>
                </div>
            </div>
            <div class="row">
                <div class="createForum-container center-align" v-if="showPopUp">
                    <div class="popup-content">
                        <span class="material-symbols-outlined" @click="openPopUp">arrow_back</span>
                        <div class="row"> 
                            <div class="col-3">
                            </div>
                            <div class="col-6">
                                <h3>Create a community</h3>
                                <!-- Upload group pic container -->
                                <div class="groupPicContainer">
                                    <p v-if="selectedGroupPic === null">No image selected</p>
                                    <img v-if="selectedGroupPic !== null" :src="selectedGroupPic" alt="Group Picture"  id="profile-picture" ref="cropperImage"/>
                                    <input ref="groupPicInput" type="file" @change="uploadImage($event, 'groupPic')" style="display: none" accept=".jpg, .jpeg, .png" required>
                                    <br>
                                </div>
                                
                                <button class="upload-banner-button" @click="selectImage('groupPic')">Customize</button>
                                
                                <!-- Upload banner container -->     
                                <div class="bannerContainer">
                                    <p v-if="selectedBanner === null">No image selected</p>
                                    <img v-if="selectedBanner !== null" :src="selectedBanner" alt="Banner"  id="profile-picture" ref="cropperImage"/>
                                    <input ref="bannerInput" type="file" @change="uploadImage($event, 'banner')" style="display: none" accept=".jpg, .jpeg, .png" required>
                                    <br>
                                </div>
                                
                                <button class="upload-banner-button" @click="selectImage('banner')">Customize</button>
                            </div>
                            
                            <div class="col-3"></div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                            </div>
                            <div class="col-6 center-align">
                                <input type="text" v-model="forumID" @input="checkForumId" placeholder="Community ID: x/" required>
                                <p v-if="duplicateID"></p>
                                <input type="text" v-model="forumName" placeholder="Community Name:" required>
                                <textarea type="text" v-model="forumDesc" :maxlength="500" placeholder="Community Description (optional)" ></textarea>
                                <select v-model="selectedCategory" name="categoryDropdown" id="categoryDropdown" >
                                    <option value="" selected hidden disabled>Category</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Dance">Dance</option>
                                    <option value="Technology">Sports</option>
                                    <option value="News">News</option>
                                </select>
                                <p v-if="showErrMsg" style="color: red;">Error: {{ errorMsg }}</p>
                            </div>
                            <div class="col-3"></div>
                        </div>
                        <button @click="createForum" :class="{ 'disabled': submitting }" :disabled="submitting">{{ submitting ? 'Creating...' : 'Create' }}</button>
                    </div>
                </div>
            </div>
        
        </div>
    </div>

</template>
<style scoped>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
.createForum-container {
    overflow-y: scroll;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
button {
    margin: 2em;
    color:white;
    background-color: var(--primary);
    border: none;
    padding: 1em;
    border-radius: 10px;

}
input[type=text],
#categoryDropdown{
    margin: 10px 0;
    padding: 1em 0.5em;
    border-radius: 5px;
}
.groupPicContainer {
    background-color: white;
    color: var(--dark);
    height: 15vh;
    width: 15vh;
    margin: auto;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.bannerContainer {
    background-color: white;
    color: var(--dark);
    height: 45vh;
    margin: auto;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
img {
    height: 100%;
    max-width: 100%;
    object-fit: cover; /* Scale and crop the image to fit */
    object-position: center; /* Center the image within the div */
}
.popup-content {
    color: white;
    background-color: var(--dark);
    padding: 20px;
    border-radius: 5px;
    margin-top: 80vh !important;
    margin-bottom: 5vh;
    width: 50vw;
}
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
}

.line {
    margin: 2em !important;
    border-top: 1px solid black;
}

#meta {
    font-size: small;
}


#threadGroupPic {
    overflow: hidden;
    float:left;
    width: 10vh;
    height: 10vh;
    margin-top: 15px;
    border-radius: 50%;
}
#thread-title {
    font-weight: bolder;
    font-size: larger;
}
#commentsText {
    margin: 1em 0 0.5em 0;
    text-decoration: none;
    color: gray !important;
}

.popularThreadContainer {
    display: flex;
    flex-direction: column;
}
.align-center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2em;
}

.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import ForumLayout from '../../components/forum/ForumLayout.vue';
import SubscribedForums from '../../components/forum/SubscribedForums.vue';
import CreatedForums from '../../components/forum/CreatedForums.vue';
import PopularThreads from '../../components/forum/PopularThreads.vue';

export default {
    components: {
        NavSidebar,
        ForumLayout,
        SearchBar,
        CreatedForums,
        SubscribedForums,
        PopularThreads,
    },
    data() {
        return {
            // Misc
            isDraggable: false,
            showPopUp: false,

            // Data to display
            subbedForums: [],
            createdForums: [],
            threads: [],
            subbedForumThreads: [],
            
            // Creation of forum var
            selectedBanner: null,
            bannerObject: null,
            selectedGroupPic: null,
            groupPicObject: null,
            images: [],
            forumID: '',
            forumName: '',
            forumDesc: '',
            forumObject: null,
            selectedCategory: null,
            duplicateID: false,
            submitting: false,
            
            //Error handling
            errorMsg: null,
            showErrMsg: false,
        }
    },
    mounted() {
    },
    methods: {
        handleVariableUpdate(variable) {
            this.showPopUp = variable;
        },
        retrieveRecentThreads(variable) {
            this.subbedForums = variable;
        },
        openPopUp() {
            this.showPopUp = !this.showPopUp
            const body = document.body;
            body.classList.remove('disable-scroll');
        },
        selectImage(type){
            if (type === 'groupPic'){
                this.$refs.groupPicInput.value = ''; // Reset the file input value
                this.$nextTick(() => {
                this.$refs.groupPicInput.click(); // Open the file input dialog
                });            
            }
            else if (type === 'banner'){
                this.$refs.bannerInput.value = ''; // Reset the file input value
                this.$nextTick(() => {
                this.$refs.bannerInput.click(); // Open the file input dialog
                });
            }
        },
        uploadImage(event, type){
            var object = event.target.files[0];
            if (type === 'groupPic'){
                this.groupPicObject = object;
                this.selectedGroupPic = URL.createObjectURL(object);
            }
            else if (type === 'banner'){
                this.bannerObject = object;
                this.selectedBanner = URL.createObjectURL(object);
            }
        
        },

        // TODO RUN THE FUNCTION WHEN FORUMID INPUT CHANGES
        checkForumId() {
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/create/${this.forumID}`, {
                method: "GET",
                credentials: "include",
                })
                .then(response => {
                    if (response.ok){
                        // No error
                        this.duplicateID = false
                    } else if (response.status === 400){
                        // Display duplicate forumID error
                        this.duplicateID = true
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
        async createForum() {
            this.submitting = true
            // Validation
            var forumDetails = [this.forumName, this.forumID, this.selectedCategory, this.selectedGroupPic,  this.selectedBanner];
            if (forumDetails.some(item => item === '' || item === null)){
                this.showErrMsg = true;
                this.submitting = false;
                return this.errorMsg = "Please enter all fields";
            }

            const uploadData = new FormData();
            uploadData.append('selectedImages', this.groupPicObject);
            uploadData.append('selectedImages', this.bannerObject);
            
            try {
                var forumObject = this.forumObject
                forumObject = {
                'forumName': this.forumName,
                'forumID': this.forumID,
                'forumDesc': this.forumDesc,
                'category': this.selectedCategory
                }
                
                uploadData.append('forumObject', JSON.stringify(forumObject))
                console.log(uploadData)
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/create`, {
                method: "POST",
                credentials: "include",
                body: uploadData
                })
                .then(async response => {
                    if (response.ok){
                        localStorage.setItem('forumID', this.forumID);
                        location.href = "/forumGroup.html"
                    } else if (response.status === 400){
                    response.json().then(data => {
                    if (data.error === 'ForumID already exists') {
                        alert("ForumID already exists");
                    }
                    });
                    
                    this.submitting = false
                    return;
                }
                })
                .catch(error => {
                    console.error('Error:', error);
            })
            } catch (error) {
                console.error('Error:', error);
            }
            
        },
    },
}
</script>