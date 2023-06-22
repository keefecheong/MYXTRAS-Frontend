<template>
    <div id="main-container">
    <NavSidebar />
    <div id="main-content" v-if="contentLoaded" >
        <div class="row">
            <div class="imageContainer row">
                <img :src="forum.banner_link[0]" alt="Banner" id="banner-picture"/>
            </div>
            <div class="row">
                <div class="col-md-2" id="pink-container">
                    <br>
                    <div class="forumMeta">
                        <div id="image">
                            <img class="groupicon" :src="forum.forum_pic_link">
                        </div>
                        <div id="group-description">
                            <h3 id="groupname">{{forum.forumName}}</h3>
                            <p id="groupid">x/{{forum.forumID}}</p>
                            <p id="groupdescription">{{forum.forumDesc}}</p>
                        </div>
                        <InterestBadgeList :selectedOption="forum.category" :selection="false" :maxWidth="'30%'" class="blog-tags" title="Tags" />
                    </div>
                    <div class="forumOptions">
                        <button :class="{ 'subscribed': isSubscribed, 'white-btn': !isSubscribed  }" v-if="!isCreator" @click="subscribeForum">{{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}</button>
                        <button @click="showCreateThread" class="white-btn">Create Thread!</button>
                        <div class="subs">
                            <p>{{"Subscribers: " + forum.numOfSubs}}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 d-flex justify-content end">
                    <div style="margin-left: 5vw !important; ">
                          
                    </div>
                </div>
            </div>
            <div id="white-container" class="row">
                <div class="col-md-8 offset-md-1">
                    <div class="card shadow" style="text-align: center; padding-top: 5vh;" v-if="threads.length === 0">
                        <p>No threads found, <a id="noThreadCreateBtn" @click="showCreateThread">create</a> one now!</p>
                    </div>
                    <threadLayout :threads="threads"/>
                </div>
                <div class="col-md-3">
                    <recommendedForums />
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
    </div>
</div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import threadLayout from '../../components/forum/ThreadLayout.vue';
import recommendedForums from '../../components/forum/RecommendedForums.vue';
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import AddInterestButton from '../../components/general/AddInterestButton.vue';

export default {
    components: {
        NavSidebar,
        SearchBar,
        threadLayout,
        recommendedForums,
        InterestBadgeList,
        AddInterestButton,
    },

    data() {
        return {
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

            recommendations: {},
            tags: [],
            //Error handling
            errorMsg: null,
            showErrMsg: false,
        }
    },
    mounted() {
        this.getForumPage()
        this.getThreads()
    },
    methods: {
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
            var threadDetails = [this.threadTitle, this.threadPicObject];
            
            if (threadDetails.some(item => item === '' || item === null)){
                this.showErrMsg = true;
                this.submitting = false;
                return this.errorMsg = "Please enter all fields";
            }

            const uploadData = new FormData();
            uploadData.append('selectedImages', this.threadPicObject);

            try {
                var threadObject = this.threadObject
                threadObject = {
                'thread_title': this.threadTitle,
                'thread_desc': this.threadDesc,
                'category': this.tags
                }
                
                uploadData.append('threadObject', JSON.stringify(threadObject))
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/create/${this.current_forumID}`, {
                method: "POST",
                credentials: "include",
                body: uploadData
                })
                .then(async response => {
                    if (response.ok){
                        //localStorage.setItem('forumID', this.forumID);
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
            var object = event.target.files[0];
            this.threadPicObject = object;
            this.selectedThreadPic = URL.createObjectURL(object);
        
        },
        async getForumPage() {
            this.current_forumID = localStorage.getItem('forumID');

            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-forum/${this.current_forumID}`, {
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
                this.forum = data.forum;
                // Stores forumPic to be displayed in threadView.html
                this.isCreator = data.isCreator;
                this.isSubscribed = data.isSubscribed;
                this.contentLoaded = true

            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        async getThreads() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-threads/${this.current_forumID}`, {
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
                this.threads = data.threads;
                console.log(this.threads)
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
                throw new Error('Response not OK');
            })
            .then(data => {   
                this.isSubscribed = data.isSubscribed

                if (this.isSubscribed){
                    this.forum.numOfSubs += 1
                }
                else{
                    this.forum.numOfSubs -= 1
                }
            })
            .catch((error) => {
                console.log("Unable to subscribe to forum: ", error);
            });
        }
    },
}
</script>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
.row {
    padding: 0 !important;
    width: 100%;
    margin: 0 !important;
}
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

.forumMeta{
    margin-top: 1rem;
    margin-left: 100px;
}

.subs {
    float: right;
}

#banner-picture {
    width: 100%;
    object-fit: cover; /* Scale and crop the image to fit */
    object-position: center; /* Center the image within the div */
    height: 150px;
    margin: 0;
    padding: 0;
}

#pink-container{
    background-color: var(--primary);
    height: 100%;
    width: 100%;
    color: white;
}

.groupicon {
    float:left;
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-radius: 50%;
    object-fit: cover; /* Scale and crop the image to fit */
    object-position: center; /* Center the image within the div */
}

.forumOptions {
    float: right;
    margin-right: 40px;
}

#group-description{
    float:left;
}

#groupname{
    color: white;
    margin-bottom: 0px;
}

#groupid{
    margin-bottom: 5px;
    font-size: 14px;
    margin-bottom: 0px;
}

#groupdescription{
    font-size: 16px;
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

.subscribed {
    background-color: transparent;
    color: white;
    border: white solid 3.5px;
    border-radius: 10px;
    place-items: center;
    height: 3rem;
    width: 8.5rem;
    transition: all 0.3s;
    margin-bottom: 5%;
}
.subscribed:hover {
    display: grid;
    background-color: white;
    border: white solid 3.5px;
    color: black;
    border-radius: 10px;
    height: 3rem;
    width: 8.5rem;
    place-items: center;
    margin-bottom: 5%;
    text-decoration: none;
    font-size: 1rem;
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