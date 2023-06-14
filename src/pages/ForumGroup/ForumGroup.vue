<template>
    <div id="main-container">
    <NavSidebar />
    <div id="main-content" v-if="contentLoaded" >
        <div id="row">
            <div class="imageContainter">
                <img :src="forum.banner_link[0]" alt="Banner" id="banner-picture"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-2" id="pink-container">
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
            </div>
            <div class="col-md-2">
                <button class="subscribe-button" v-if="!isCreator" @click="subscribeForum">Subscribe</button>
            </div>
            <div class="col-md-2">
                <div style="margin-left: 5vw !important; ">
                    <p>{{"Subscribers: " + forum.numOfSubs}}</p>
                </div>
            </div>
        </div>
        <div id="white-container" class="row">
            <div class="col-md-8 offset-md-1">
                <threadLayout/>
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
            contentLoaded: false,
            isCreator: false,
            threads: []
        }
    },
    mounted() {
        this.getForumPage()
    },
    methods: {
        getForumPage() {
            const forumID = localStorage.getItem('forumID');

            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-forum/${forumID}`, {
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
                this.isCreator = data.isCreator;    
                this.contentLoaded = true

            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
        subscribeForum(){
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/subscribe-forum/${forumID}`, {
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
                this.isCreator = data.isCreator;    
                this.contentLoaded = true

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
    body{
        overflow-x: hidden;
    }
    .forumMeta{
        margin-top: 0.5em;
        display: inline-flex;
    }
    .imageContainter {
        height: 20vh;
        overflow: hidden;
    }
    .imageContainter img {
        max-width: 100%;
        object-fit: cover;
    }
    #pink-container{
        background-color: #E53A73;
        height: 100%;
        width: 100%;
    }

    .subscribe-button{
        background-color: transparent;
        color: white;
        padding: 10px 30px;
        font-size: 15px;
        border-radius: 10px;
        font-weight: bold;
        border: 2px solid white;
        margin-top: 25px;
        margin-left: 55px;
    }

    .groupicon {
        float:left;
        overflow: hidden;
        width: 60px;
        height: 60px;
        margin-left: 150px;
        margin-right: 20px;
        border-radius: 50%;
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
        overflow: hidden;
        float:left;
        width: 65px;
        height: 65px;
        margin-right: 20px;
        margin-top: 15px;
        border-radius: 50%;

    }

    .groupPic{
        overflow: hidden;
        float:left;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        margin-top: 10px;
        margin-left: 25px;
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

    .text-below-pic {
        margin-top: 5px;
    }
</style>