<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content" v-if="contentLoaded">
            <div class="row">
                <div class="imageContainer">
                    <img :src="forumBannerPic" alt="Banner" id="banner-picture"/>
                </div>
            </div>
            <div class="row">
                <div id="pink-container">
                    <div id="image" class="col-md-1">
                        <img class="imageIcon" :src="forumGroupPic">
                    </div>
                    <div id="group-description" class="col-md-1">
                        <h5 id="groupname">x/{{ forumID }}</h5>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-9">
                    <div class="card">
                        <div class="row threadContent">
                            <h2> {{ thread.thread_title}}</h2>
                            <h6> {{ thread.thread_desc}} </h6>
                        </div>
                        <div class="row">
                            <div id="threadImageContainer">
                                <img id="threadImage" :src="thread.content_links[0]">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="reactionContainer">
                                    <span class="material-symbols-outlined reactionBtns">sentiment_very_satisfied</span>
                                    <span class="material-symbols-outlined reactionBtns">sentiment_very_dissatisfied</span>
                                </div>
                            </div>
                            <div class="col-6 d-flex justify-content-end">
                                <p>Posted by: @</p>
                                <br>
                                <p>{{thread.creator_id.username }}</p>
                                <img class="profilepic" :src="thread.creator_id.profile_pic_link" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-9">
                                <textarea placeholder="Anything Xtra to say?" style="width: 100%;" v-model="commentText"></textarea>
                            </div>
                            <div class="col-md-3">
                                <button @click="createComment">Comment</button>
                            </div>
                        </div>
                        <hr>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card shadow">
                        <div class="card-body">
                            <h4 class="card-title">Recommendations</h4>
                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>

                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>
                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>
                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>
                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>
                            <div class="group-container">
                                <img class="groupPic" :src="groupPic" />
                                <p class="text-below-pic">Grp 2</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="!commentsLoaded">
                <div v-for="comment in commentData">
                    <img :src="comment.creator_id.profile_pic_link" class="imageIcon">   
                    <p>{{ comment.creator_id.real_name }}</p>
                    <p>{{ '@' + comment.creator_id.username }}</p>
                    <p>{{comment.content }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import groupPic from '../../assets/NgeeAnnLogo.png'


export default {
    components: {
        NavSidebar,
        SearchBar,
    },
    data() {
        return {
            commentText: null,
            contentLoaded: false,
            commentsLoaded: false,
            forumID: null,
            forumGroupPic: null,
            forumBannerPic: null,
            current_threadID: null,
            submittingComment: false,
            commentData: {},
            // threadDetails: {
            // title: "How do I make my parents proud?",
            // description: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are some ways I can get their attention?",
            // creator_name: "Pompourous",
            // pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
            // comments: [
            //     {
            //     creator_name: "Lim Long Teck",
            //     creator_username: "notatryhard",
            //     content: "Where got time brotherman",
            //     pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
            //     creation_date: "12-11-25, 5 days ago",
            //     subcomments: [
            //         {
            //         creator_name: "Lee Wee Kang",
            //         creator_username: "Pompourous",
            //         content: "@notatryhard Seriously?",
            //         pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
            //         creation_date: "12-11-25, 5 days ago"
            //         }
            //     ]
            //     }
            // ]
            // },
        }
    },
    mounted() {
        this.getForumPage()
        this.getComments()
    },
    methods: {
        async getForumPage() {
            this.forumID = localStorage.getItem('forumID');
            this.forumGroupPic = localStorage.getItem('forumGroupPic');
            this.forumBannerPic = localStorage.getItem('forumBannerPic');
            this.current_threadID = localStorage.getItem('threadID');
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-thread/${this.current_threadID}`, {
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
                this.thread = data;
                this.contentLoaded = true
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        async createComment() {
            this.submittingComment = true;

            // do nothing if no content is entered
            if (this.commentText.trim().length <= 0) {
                this.submittingComment = false;
                return;
            }

            // upload comment
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.current_threadID}`, {
                mode: 'cors',
                method: 'POST',
                body: JSON.stringify({
                    content: this.commentText.trim()
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            }).then(async (res) => {
                await res.json().then((data) => {
                    this.submittingComment = false;
                    alert(data.message);

                    // update comments list to update dom immediately
                    if (res.status == 200) {
                        this.thread.comments.push(data.comment._id);
                        this.commentData.push(data.comment);
                    }

                    this.commentText = '';
                });
            }).catch((error) => {
                console.log(error);
            })
        },
        async getComments() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/comments/${this.current_threadID}`, {
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
                this.commentData = data.comments;
                console.log(this.commentData)
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
.reactionContainer {
    display: inline-block;
}
.reactionBtns {
    
    color: black !important;
}
body {
    background-color: white !important;
    overflow-x: hidden;
}
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 0;
}
#group-description {
    display: flex;
    align-items: center; 
    justify-content: center;
    height: 10vh;
}
.threadContent {
    padding: 1em 4em;
}
#threadImageContainer {
    max-height: 50vh;
    display: flex;
    justify-content: center;
}
#threadImage{
    max-height: 100%;
    max-width: 100%;
}
/* .triangle {
  position: relative;
  height: 100px;
  width: 325px;
  background-color: var(--primary);
  border-radius: 25px 25px 25px 0;
}

.triangle::before {
  content: "";
  position: absolute;
  
  background-color: transparent;
  bottom: -50px;
  height: 50px;
  width: 25px;
  border-top-left-radius: 25px;
  box-shadow: 0 -25px 0 0 #F66969;
} */
#banner-picture {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    padding: 0 !important;
}
.imageIcon {
    float:left;
    overflow: hidden;
    width: 60px;
    height: 60px;
    margin-left: 150px;
    margin-right: 20px;
    border-radius: 50%;
}
#pink-container{
    background-color: var(--primary);
}
.group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;
    float: left;
}
.profilepic {
    overflow: hidden;
    width: 6vh;
    height: 6vh;
    margin-right: 20px;
    margin-top: 15px;
    border-radius: 50%;

}

.text-below-pic {
    margin-top: 5px;
}

</style>