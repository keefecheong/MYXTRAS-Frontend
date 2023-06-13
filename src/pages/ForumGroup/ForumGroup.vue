<template>

    <div id="main-container">
        <NavSidebar />
        <div v-if="contentLoaded" id="main-content">
            <div id="row">
                <img :src="forum.banner_link[0]" alt="Banner" id="banner-picture"/>
            </div>
            <div class="row">
                <div id="pink-container">
                <div id="image">
                    <img class="groupicon" :src="forum.forum_pic_link">
                </div>
                <div id="group-description">
                    <h1 id="groupname">{{forum.forumName}}</h1>
                    <p id="groupid">x/{{forum.forumID}}</p>
                    <p id="groupdescription">{{forum.forumDesc}}</p>
                 </div>
                <button class="subscribe-button">Subscribe</button>
            </div>
            <div id="white-container" class="row">
                <div class="col-md-8 offset-md-1">
                    <threadLayout/>
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
        </div>
        
    </div>
</div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import threadLayout from '../../components/forum/ThreadLayout.vue';
import banner from '../../assets/ForumBanner.png'
import groupPic from '../../assets/NgeeAnnLogo.png'


export default {
    components: {
        NavSidebar,
        SearchBar,
        threadLayout,
    },

    data() {
        return {
            groupPic: groupPic,
            forum: null,
            contentLoaded: false,
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
                this.forum = data;
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

    body{
        overflow-x: hidden;
    }

    #banner-picture{
        height: 150px;
        width: 105%;
        object-fit: cover;
        padding: 0 !important;
        margin-left: -12px;
        float: left;
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
        font-size: 35px;
        margin-bottom: 0px;
    }

    #groupid{
        margin-bottom: 5px;
        font-size: 14px;
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