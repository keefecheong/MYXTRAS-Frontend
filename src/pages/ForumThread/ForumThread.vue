<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="row">
                <img :src="banner" alt="Banner" id="banner-picture"/>
            </div>
            <div class="row">
                <div id="pink-container">
                    <div id="image">
                        <img class="groupicon" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                    </div>
                    <div id="group-description">
                        <h1 id="groupname">x/nerdfest</h1>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-9">
                    <div class="card row" id="threads">
                        

                        
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card">
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
body {
    background-color: white !important;
    overflow-x: hidden;
}
#banner-picture {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    padding: 0 !important;
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