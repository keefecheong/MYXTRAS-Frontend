<template>

    <div id="main-container">
        <NavSidebar />
        <div id="main-content">
            <div id="row">
                <img :src="banner" alt="Banner" id="banner-picture"/>
            </div>
            <div class="row">
                <div id="pink-container">
                <div id="image">
                    <img class="groupicon" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                </div>
                <div id="group-description">
                    <h1 id="groupname">nerdytunes</h1>
                    <p id="groupid">x/nerdfest</p>
                    <p id="groupdescription">We will help you get the grade you want</p>
                 </div>
                <button class="subscribe-button">Subscribe</button>
            </div>
            

                
            <div id="white-container" class="row">
                <div class="col-md-8 offset-md-1">
                    <div class="card row" id="threads">
                        <div class="card-body">
                            <div id="image" class="col-md-1">
                                <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                            </div>

                            <div id="text-content" class="col-md-10 offset-md-1">
                                <p>Amy Tan - @iloveapples</p>
                                <h5 class="card-title">How do I make my parents proud?</h5>
                                <p class="card-text">My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...</p>
                            </div>
                            
                        </div>
                    </div>
                    <div class="card row" id="threads">
                        <div class="card-body">
                            <div id="image" class="col-md-1">
                                <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                            </div>

                            <div id="text-content" class="col-md-10 offset-md-1">
                                <p>Amy Tan - @iloveapples</p>
                                <h5 class="card-title">How do I make my parents proud?</h5>
                                <p class="card-text">My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...</p>
                            </div>
                            
                        </div>
                    </div>
                    <div class="card row" id="threads">
                        <div class="card-body">
                            <div id="image" class="col-md-1">
                                <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                            </div>

                            <div id="text-content" class="col-md-10 offset-md-1">
                                <p>Amy Tan - @iloveapples</p>
                                <h5 class="card-title">How do I make my parents proud?</h5>
                                <p class="card-text">My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...</p>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card" style="height:500px; text-align: center; margin-top: 50px; margin-right: 10px;">
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
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';
import banner from '../../assets/ForumBanner.png'
import groupPic from '../../assets/NgeeAnnLogo.png'


export default {
    components: {
        NavSidebar,
        SearchBar,
        banner,
    },

    data() {
        return {
            banner: banner,
            groupPic: groupPic,
        }
  },
}
</script>

<style>

    body{
        overflow-x: hidden;
    }

    /* #main-content{
        margin-left: -12px;
    } */

    #banner-picture{
        max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    padding: 0 !important;
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
        background-color: #E4E0E7;
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