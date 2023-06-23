<template>

    <AlertPrompt v-if="showAlert && alertMsg.length > 0" @close-alert="closeAlert">
        {{ alertMsg }}
    </AlertPrompt>

    <div id="main-container">
    <NavSidebar />
    <div id="main-content" v-if="contentLoaded" >
        <div class="row">
            <ForumViewHeader
                :bannerLink="forum.banner_link"
                :forumPicLink="forum.forum_pic_link"
                :forumName="forum.forumName"
                :forumID="forum.forumID"
                :forumDesc="forum.forumDesc"
                :numOfSubs="numOfSubs"
                :isCreator="isCreator"
                :isSubscribed="isSubscribed"
                :showCreateThreadButton="true"
                :tags="forum.tags"
                @show-forum-form="() => toggleForumForm(true)"
                @show-thread-form="showCreateThread"
                @subscribe="subscribeForum"
            />
            
            <div id="white-container" class="row">
                <div class="col-md-8 offset-md-1">
                    <div class="card shadow" style="text-align: center; padding-top: 5vh;" v-if="threads.length === 0">
                        <p>No threads found, <a id="noThreadCreateBtn" @click="showCreateThread">create</a> one now!</p>
                    </div>
                    <RouterLink to="/">
                        <ThreadLayout :threads="threads"/>
                    </RouterLink>
                    <RouterView/>
                </div>
                <div class="col-md-3">
                    <RecommendedForums />
                </div>
            </div>
            <div class="row">
                <div class="createThread-container center-align" v-if="showPopUp">
                    <div class="popup-content">
                        <button id="close-form" @click="showCreateThread" type="button">
                            <span class="material-symbols-outlined">Close</span>
                        </button>

                        <h1>Create a new thread</h1>
                        
                        <!-- Upload group pic container -->
                        <div class="row">
                            <div class="threadPicContainer">
                                <p v-if="selectedThreadPic === null">No image selected</p>
                                <img v-if="selectedThreadPic !== null" :src="selectedThreadPic" alt="Group Picture"  id="thread-picture" ref="cropperImage"/>
                                <input ref="threadPicInput" type="file" @change="uploadImage($event)" style="display: none" accept=".jpg, .jpeg, .png">
                            </div>
                            <button class="image-form-control-button" @click="selectImage()">Customize</button>
                        </div>

                        <div class="label-row">
                            <label for="thread-title" class="thread-title" id="label">Thread Title:</label>
                            <input type="text" v-model="threadTitle" placeholder="Required" id="title" required>
                        </div>

                        <div class="label-row">
                            <label for="thread-desc" class="thread-desc" id="label">Thread Description:</label>
                            <textarea type="text" v-model="threadDesc" :maxlength="500" placeholder="Thread Description (optional)" id="desc"></textarea>
                        </div>

                        <div class="label-row">
                            <label for="categoryDropdown" class="categoryDropdown" id="label">Category:</label>
                            <div id="interestBtn">
                                <AddInterestButton id="categoryDropdown" :selectedOption="tags" @selectedInterests="handlePostTags">
                                    Select Tags For Your Post (Optional):
                                </AddInterestButton>
                            </div>
                        </div>
                        <p v-if="showErrMsg" style="color: red;">Error: {{ errorMsg }}</p>
                        <button @click="createThread" class="image-form-control-button" :class="{ 'disabled': submitting }" :disabled="submitting">{{ submitting ? 'Creating...' : 'Create' }}</button>
                    </div>
                </div>
            </div>
        </div>

        <ForumFormLayout v-if="showForumForm" :editMode="true" :forum="forum" @close-forum-form="() => toggleForumForm(false)" />
    </div>
</div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import ThreadLayout from '../../components/forum/ThreadLayout.vue';
import RecommendedForums from '../../components/forum/RecommendedForums.vue';
import ForumFormLayout from '../../components/forum/ForumFormLayout.vue';
import ForumViewHeader from '../../components/forum/ForumViewHeader.vue';
import AlertPrompt from '../../components/general/AlertPrompt.vue';
import { useAlertStore } from '../../stores/AlertStore.js';import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import AddInterestButton from '../../components/general/AddInterestButton.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
        ThreadLayout,
        RecommendedForums,
        ForumFormLayout,
        ForumViewHeader,
        AlertPrompt,
        InterestBadgeList,
        AddInterestButton,
    },

    data() {
        return {
            showForumForm: false,
            showThreadForm: false,
            alertStore: useAlertStore(),

            forum: null,
            current_forumID: null,
            contentLoaded: false,
            isCreator: false,
            threads: [],
            showPopUp: false,

            selectedThreadPic: null,
            threadPicObject: null,
            threadTitle: null,
            threadDesc: null,
            submitting: false,
            isSubscribed: false,
            forumID: null,
            forumObjId: null,
            recommendations: {},
            tags: [],
            //Error handling
            errorMsg: null,
            showErrMsg: false,
        }
    },
    mounted() {
        this.getForumPage()
    },
    watch: {
        forumObjId: {
            immediate: false,
            handler(newVal, oldVal) {
                this.getThreads();
            }
        },
    },
    methods: {
        // toggle forum form for editing
        toggleForumForm(show) {
            this.showForumForm = show;
        },
        // toggle thread form for creating
        toggleThreadCreateForm(show) {
            this.showThreadForm = show;
        },
        toggleScrolling() {
            // Get the body element
            const body = document.body;
            if (body.classList.contains('disable-scroll')) {
                body.classList.remove('disable-scroll');
            } else {
                body.classList.add('disable-scroll');
            }
        },
        showCreateThread() {
            this.toggleScrolling()
            this.showPopUp = !this.showPopUp
        },
        async createThread() {
            this.submitting = true
            // Validation
            let threadDetails = [this.threadTitle];
            
            if (threadDetails.some(item => item === '' || item === null)){
                this.showErrMsg = true;
                this.submitting = false;
                return this.errorMsg = "Please enter all fields";
            }

            const uploadData = new FormData();
            if (this.threadPicObject !== null){
                uploadData.append('selectedImages', this.threadPicObject);
            }

            try {
                let threadObject = {
                'thread_title': this.threadTitle,
                'thread_desc': this.threadDesc,
                'tags': this.tags
                }
                
                uploadData.append('threadObject', JSON.stringify(threadObject))
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/create/${this.forumObjId}`, {
                method: "POST",
                credentials: "include",
                body: uploadData
                })
                .then(async response => {
                    if (response.ok){
                        localStorage.setItem('forumID', this.forumID);
                        location.href = "/forumGroup.html"
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
        selectImage(){
            this.$refs.threadPicInput.value = ''; // Reset the file input value
                this.$nextTick(() => {
                this.$refs.threadPicInput.click(); // Open the file input dialog
            });            
        },
        uploadImage(event){
            let object = event.target.files[0];
            this.threadPicObject = object;
            this.selectedThreadPic = URL.createObjectURL(object);
        
        },
        async getForumPage() {
            this.forumID = localStorage.getItem('forumID');

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-forum/${this.forumID}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    console.log('An error occured');
                }
            })
            .then(data => {
                this.forum = data.forum;
                this.forumObjId = data.forum._id
                // Stores forumPic to be displayed in threadView.html
                this.isCreator = data.isCreator;
                this.isSubscribed = data.isSubscribed;
                this.contentLoaded = true
            })
            .catch((error) => {
                console.log(error);
            });
            
        },
        async getThreads() {
            console.log(this.forumObjId)
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-threads/${this.forumObjId}`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Response not OK');
            })
            .then(data => {
                this.threads = data;
            })
            .catch((error) => {
                console.log("The threads could not be loaded: ", error);
            });
        },
        subscribeForum(){
            this.isSubscribed = true
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/subscribe-forum/${this.forum._id}`, {
                mode: 'cors',
                method: 'POST',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    console.log('An error occurred.');
                }
            })
            .then(data => {   
                this.isSubscribed = data.isSubscribed

                if (this.isSubscribed){
                    this.forum.subscribers.push(data.userId);
                }
                else{
                    const index = this.forum.subscribers.indexOf(data.userId);
                    this.forum.subscribers.splice(index, 1);
                }
            })
            .catch((error) => {
                console.log("Unable to subscribe to forum: ", error);
            });
        },
        // to close alert prompt
        closeAlert() {
            this.alertStore.closeAlert();
        }
    },
    computed: {
        // get number of subscribers
        numOfSubs() {
            return this.forum.subscribers.length;
        },
        // to get showAlert value
        showAlert() {
            return this.alertStore.showAlert;
        },
        // to get alertMsg value
        alertMsg() {
            return this.alertStore.alertMsg;
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

#noThreadCreateBtn {
    color: blue;
}
#noThreadCreateBtn:hover {
    color: var(--primary);
    cursor: pointer;
}
#main-container {
    margin-left: -12px;
}

.createThread-container {
    overflow-y: scroll;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
    color: white;
    background-color: var(--dark);
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 5vh;
    width: 50vw;
    row-gap: 20px;
}

.subs {
    float: right;
}

#white-container{
    background-color: #fefefe;
    height: 100%;
    width: 100%;
}

.profilepic {
    float:left;
    width: 65px;
    height: 65px;
    margin-right: 20px;
    margin-top: 15px;
    border-radius: 50%;
}

#threads{
    margin: 20px;
    margin-top: 50px;
}

.group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;
    float: left;
}

#close-form {
    background-color: transparent;
    border: none;
    outline: none;
    float: right;
}

.image-form-control-button {
    margin-left: auto;
    margin-right: auto;
    margin-top: 1rem !important;
    margin-bottom: 1rem;
    background-color: #E53A73;
    border: none;
    width: 10rem !important;
    border-radius: 10px;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
}

#thread-picture {
    width: 90%;
    object-fit: cover; /* Scale and crop the image to fit */
    object-position: center; /* Center the image within the div */
    height: 150px;
    border-radius: 10px;
}

#label {
    float: left !important;

}

.label-row {
    margin-bottom: 10px !important;
    margin-left: 6%;
    margin-right: 7%;
}

#title, #desc, #categoryDropdown {
    border-radius: 10px;
    padding: 10px;
}

#title {
    margin-left: 5.5rem;
    width: 70%;
}
#interestBtn {
    margin-left: 12vw;
    width: 70%;
}
#desc {
    margin-left: 2rem;
    width: 70%;
}

#categoryDropdown {
    margin-right: 13rem;
    width: 20%;
    justify-content: start;
}

</style>