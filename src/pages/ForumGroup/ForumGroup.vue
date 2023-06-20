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
                    </div>
                    <div class="forumOptions">
                        <button :class="{ 'subscribed': isSubscribed, 'pink-btn': !isSubscribed  }" v-if="!isCreator" @click="subscribeForum">{{ isSubscribed ? 'Unsubscribe' : 'Subscribe' }}</button>
                        <button @click="showCreateThread" class="pink-btn">Create Thread!</button>
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
                    <threadLayout :threads="threads"/>

                </div>
                <div class="col-md-3">
                    <div class="card shadow">
                        <div class="card-body">
                            <h4 class="card-title">Recommendations</h4>

                            <!-- max 6 groups -->
                            <div class="group-container" v-for="group in groups">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="createThread-container center-align" v-if="showPopUp">
                    <span class="material-symbols-outlined" @click="showCreateThread">back</span>
                    <div class="popup-content">
                        <div class="row"> 
                            <div class="col-3">
                            </div>
                            <div class="col-6">
                                <h3>Create a community</h3>
                                <!-- Upload group pic container -->
                                <div class="groupPicContainer">
                                    <p v-if="selectedThreadPic === null">No image selected</p>
                                    <img v-if="selectedThreadPic !== null" :src="selectedThreadPic" alt="Group Picture"  id="profile-picture" ref="cropperImage"/>
                                    <input ref="threadPicInput" type="file" @change="uploadImage($event)" style="display: none" accept=".jpg, .jpeg, .png" required>
                                    <br>
                                </div>
                                
                                <button class="upload-banner-button" @click="selectImage()">Customize</button>
                            </div>
                            
                            <div class="col-3"></div>
                        </div>
                        <div class="row">
                            <div class="col-3">
                            </div>
                            <div class="col-6 center-align">
                                <input type="text" v-model="threadTitle" placeholder="Thread Title" required>
                                <input type="text" v-model="threadDesc" :maxlength="500" placeholder="Thread Description" required>
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
                        <button @click="createThread" :class="{ 'disabled': submitting }" :disabled="submitting">{{ submitting ? 'Creating...' : 'Create' }}</button>
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


export default {
    components: {
        NavSidebar,
        SearchBar,
        threadLayout,
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
            selectedCategory: [],
            submitting: false,
            isSubscribed: false,

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
            var threadDetails = [this.threadTitle, this.threadDesc, this.threadPicObject];
            
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
                'category': this.selectedCategory
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
                localStorage.setItem('forumGroupPic', this.forum.forum_pic_link[0]);
                localStorage.setItem('forumBannerPic', this.forum.banner_link[0]);
                this.isCreator = data.isCreator;
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
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
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
                console.log("This page could not be loaded: ", error);
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
    border-radius: 5px;
    margin-bottom: 5vh;
    width: 50vw;
}

.forumMeta{
    margin-top: 1rem;
    margin-left: 100px;
}

.subs {
    margin-top: 5%;
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

.groupPic{
    float:left;
    width: 80px;
    height: 80px;
    margin-right: 20px;
    margin-top: 10px;
    margin-left: 25px;
    border-radius: 50%;
}

.pink-btn {
    background-color: #ffffff;
    border: transparent;
    border-radius: 10px;
    color: black;
    height: 3rem;
    width: 8.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    text-decoration: none;
    text-align: center;
}

.pink-btn:hover {
    background-color: transparent;
    color: white;
    border: transparent solid 3.5px;
    cursor: pointer;
    font-weight: bold;
}
.subscribed {
    background-color: transparent;
    color: #fff;
    border: white solid 3.5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 3rem;
    width: 8.5rem;
    transition: all 0.3s;
}
.subscribed:hover {
    background-color: white;
    color: black;
    border: white solid 3.5px;
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

.text-below-pic {
    margin-top: 5px;
}
</style>