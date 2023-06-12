<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="row">
                <img :src="banner" alt="Banner" id="banner-picture"/>
            </div>
            <div class="row">
                <div id="pink-container">
                    <div id="image" class="col-md-1">
                        <img class="imageIcon" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                    </div>
                    <div id="group-description" class="col-md-1">
                        <h5 id="groupname">x/nerdfest</h5>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-9">
                    <div class="card">
                        <div class="row threadContent">
                            <h2> {{ threadDetails.title}}</h2>
                            <h6> {{ threadDetails.description}} </h6>
                        </div>
                        <div class="row threadContent">
                            <div id="threadImageContainer">
                                <img id="threadImage" :src="threadDetails.pfpPic">
                            </div>
                        </div>
                        <hr>
                        <div v-for="comment in threadDetails.comments">
                            <img :src="comment.pfpPic" class="imageIcon">   
                            <p>{{ comment.creator_name }}</p>
                            <p>{{ '@' + comment.creator_username }}</p>
                            <p>{{comment.content }}</p>
                        </div>
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
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';
import banner from '../../assets/ForumBanner.png'
import groupPic from '../../assets/NgeeAnnLogo.png'


export default {
    components: {
        NavSidebar,
        SearchBar,
        banner,
    },
    mounted() {
        this.tests()
    },
    data() {
        return {
            banner: banner,
            groupPic: groupPic,
            test: 'hi',
            threadDetails: {
            title: "How do I make my parents proud?",
            description: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are some ways I can get their attention?",
            creator_name: "Pompourous",
            pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
            comments: [
                {
                creator_name: "Lim Long Teck",
                creator_username: "notatryhard",
                content: "Where got time brotherman",
                pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
                creation_date: "12-11-25, 5 days ago",
                subcomments: [
                    {
                    creator_name: "Lee Wee Kang",
                    creator_username: "Pompourous",
                    content: "@notatryhard Seriously?",
                    pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
                    creation_date: "12-11-25, 5 days ago"
                    }
                ]
                }
            ]
            },
            // threadDetails: {title: "How do I make my parents proud?", 
            // description: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are some ways I can get their attention?", 
            // creator_name: "Pompourous", pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png",
            // comments : { creator_name: "Lim Long Teck", creator_username: "notatryhard", content: "Where got time brotherman", 
            // pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", 
            // creation_date: "12-11-25, 5 days ago", subcomments: {creator_name: "Lee Wee Kang", 
            // creator_username: "Pompourous", content: "@notatryhard Seriously?", 
            // pfpPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", 
            // creation_date: "12-11-25, 5 days ago"}}},
        }
    },
    methods: {
        tests() {
            console.log(this.threadDetails)
        }
    },
}

</script>

<style>

@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
body {
    background-color: white !important;
    overflow-x: hidden;
}
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
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
    background-color: #E53A73;
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
    float:left;
    width: 65px;
    height: 65px;
    margin-right: 20px;
    margin-top: 15px;
    border-radius: 50%;

}

.text-below-pic {
    margin-top: 5px;
}

</style>