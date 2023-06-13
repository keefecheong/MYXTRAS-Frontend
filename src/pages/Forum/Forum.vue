<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="forums" :showPopUp="showPopUp" @show-popup="handleVariableUpdate"/>
            <br>
            <h1 id="forumHeader">Latest Updates!</h1>
            <div class="row">
                <div class="col-md-3">
                   <SubscribedForums :subbedForums="subbedForums"/>
                   <CreatedForums :createdForums="createdForums"/>
                </div>
            
                <div class="col-md-6">
                    <div class="row">
                        <ForumLayout v-for="thread in threads" :thread="thread"/>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card shadow">
                        <div class="card-body card-position">
                            <h5 class="card-title">Popular Threads</h5>
                            <div v-for="thread in popularThreads" class="row align-center">
                                <div class="col-md-12 d-flex popularThreadContainer">
                                    <p class="profilepic">{{ thread.threadTitle }}</p>
                                    <div class="imageContainer">
                                        <img id="popThreadPic" :src="thread.threadPic" :draggable="isDraggable">
                                    </div>
                                </div>
                                <div class="line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- TO DO disable y scrolling when popup is shown -->
            <div class="row">
                <div class="createForum-container center-align" v-if="showPopUp">
                    <span class="material-symbols-outlined" id="infoSym">back</span>
                    <div class="popup-content">
                        <div class="row"> 
                            <div class="col-3">
                            </div>
                            <div class="col-6">
                                <h3>Create a community</h3>
                                <!-- Upload group pic container -->
                                <div class="groupPicContainer">
                                    <p v-if="selectedGroupPic === null">No image selected</p>
                                    <div class="image-container">
                                        <img v-if="selectedGroupPic !== null" :src="selectedGroupPic" alt="Group Picture"  id="profile-picture" ref="cropperImage"/>
                                    </div>
                                    <input ref="groupPicInput" type="file" @change="uploadImage($event, 'groupPic')" style="display: none" accept=".jpg, .jpeg, .png" required>
                                    <br>
                                </div>
                                
                                <button class="upload-banner-button" @click="selectImage('groupPic')">Customize</button>
                                
                                <!-- Upload banner container -->     
                                <div class="bannerContainer">
                                    <p v-if="selectedBanner === null">No image selected</p>
                                    <div class="image-container">
                                        <img v-if="selectedBanner !== null" :src="selectedBanner" alt="Banner"  id="profile-picture" ref="cropperImage"/>
                                    </div>
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
                                <input type="text" v-model="forumID" placeholder="Community ID: x/" required>
                                <input type="text" v-model="forumName" placeholder="Community Name:" required>
                                <input type="text" v-model="forumDesc" :maxlength="500" placeholder="Community Description" required>
                                <select v-model="selectedCategory" name="categoryDropdown" id="categoryDropdown" >
                                    <option value="" selected hidden disabled>Category</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Dance">Dance</option>
                                    <option value="Technology">Sports</option>
                                    <option value="News">News</option>
                                </select>
                                <p v-if="showErrMsg">Error: {{ errorMsg }}</p>
                            </div>
                            <div class="col-3"></div>
                        </div>
                        <button @click="createForum">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
.center-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.createForum-container {
    overflow-y: scroll;
    position: fixed;
    top: 0;
    left: 0;
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
.image-container {
    display: flex;
    height: 100%;
}
.groupPicContainer .image-container img {
    max-height: 100%;
    max-width: 100%;
    margin: auto;
    border-radius: 100%;
}
.popup-content {
    color: white;
    background-color: var(--dark);
    padding: 20px;
    border-radius: 5px;
    margin-top: 110vh !important;
    margin-bottom: 5vh;
    width: 50vw;
}
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
}
.card-title {
    font-size: 2rem;
    text-align: center;
}
.threadContainer {
    padding: 2em 3em 1em 3em !important;

}
.threadContent {
    padding-right: 2em !important;
}
#forumHeader {
    color: var(--primary);
    font-weight: bolder;
    margin-bottom: 0.5em;
}
.line {
    margin: 2em !important;
    border-top: 1px solid black;
}
#meta {
    font-size: small;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;

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
.forum-name {
    margin-top: 1.5em;
}
</style>
<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import ForumLayout from '../../components/forum/ForumLayout.vue';
import SubscribedForums from '../../components/forum/SubscribedForums.vue';
import CreatedForums from '../../components/forum/CreatedForums.vue';
export default {
    components: {
        NavSidebar,
        SearchBar,
        ForumLayout,
        CreatedForums,
        SubscribedForums
    },
    data() {
        return {
            // Misc
            isDraggable: false,
            showPopUp: false,

            // Data to display
            subbedForums: [],
            createdForums: [],

            // Creation of forum var
            selectedBanner: null,
            bannerObject: null,
            selectedGroupPic: null,
            groupPicObject: null,
            images: [],
            forumID: null,
            forumName: null,
            forumDesc: null,
            forumObject: null,
            selectedCategory: null,
            errorMsg: null,

            showErrMsg: false,
            // followedGroupthreads: [
            //     {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://previews.123rf.com/images/parinyabinsuk/parinyabinsuk1407/parinyabinsuk140700176/30136368-young-asian-boy-being-scolded-by-parents.jpg" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
            //     {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10},
            //     {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://www.icegif.com/wp-content/uploads/icegif-2013.gif" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
            //     {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10}
            // ],
            // popularThreads: [
            //     {threadTitle: "How do I make my parents proud?", threadPic:"https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png" },
            //     {threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png"}
            // ]
        }
    },
    mounted() {
        this.retrieveCreatedForums();
        this.retrieveSubbedForums();
    },
    methods: {
        handleVariableUpdate(variable) {
            this.showPopUp = variable;
        },
        retrieveSubscribedGroups(){
            fetch("http://127.0.0.1:5173/")
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
        createForum() {
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
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/create`, {
                method: "POST",
                credentials: "include",
                body: uploadData
                })
                .then(response => {
                    if (response.ok){
                        localStorage.setItem('forumID', this.forumID);
                        location.href = "/forumGroup.html"
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
            })
            } catch (error) {
                console.error('Error:', error);
            }
            
            // Close the popup after submission
            this.showPopUp = false;
            const body = document.body;
            body.classList.remove('disable-scroll');
        },

        async retrieveSubbedForums() {
            
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-subbed-forums/`, {
                method: "GET",
                credentials: "include"
                })
                .then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        this.subbedForums = data
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
        async retrieveCreatedForums() {
            
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-created-forums/`, {
                method: "GET",
                credentials: "include"
                })
                .then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        this.createdForums = data
                        console.log(this.createdForums)
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
    },
}
</script>