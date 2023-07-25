<template>
    <div id="main-container">
        <NavSidebar :forAdmin="true" />
        <div id="main-content">
            <div id="header">
                <h1 id="title">Banned Users</h1>
            </div>

            <div id="logs_header" class="row">
                <div class="col-sm-1">
                    <p id="header_content"></p>
                </div> 
                <div class="col-sm-2">
                    <p id="header_content">Real Name</p>
                </div>      
                <div class="col-sm-2">
                    <p id="header_content">Username</p>
                </div>     
                <div class="col-sm-3">
                    <p id="header_content">Reason of Termination</p>
                </div>     
                <div class="col-sm-2">
                    <p id="header_content">Date of Termination</p>
                </div>                
                <div class="col-sm-2">
                    <p></p>
                </div>      
            </div>

            <div id="logs_content" class="row">
                <div class="col-sm-1">
                    <img :src="profilePicture" alt="Profile Picture" id="profile-picture"/>
                </div> 
                <div class="col-sm-2">
                    <p>Ching Chong Seng</p>
                </div>      
                <div class="col-sm-2">
                    <p>@wakakaka</p>
                </div>     
                <div class="col-sm-3">
                    <p>Posted graphical content into the blogs...</p>
                </div>     
                <div class="col-sm-2">
                    <p>12-3-23, 5:10PM</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-1">
                    <img :src="profilePicture" alt="Profile Picture" id="profile-picture"/>
                </div> 
                <div class="col-sm-2">
                    <p>Ching Chong Seng</p>
                </div>      
                <div class="col-sm-2">
                    <p>@wakakaka</p>
                </div>     
                <div class="col-sm-3">
                    <p>Posted graphical content into the blogs...</p>
                </div>     
                <div class="col-sm-2">
                    <p>12-3-23, 5:10PM</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-1">
                    <img :src="profilePicture" alt="Profile Picture" id="profile-picture"/>
                </div> 
                <div class="col-sm-2">
                    <p>Ching Chong Seng</p>
                </div>      
                <div class="col-sm-2">
                    <p>@wakakaka</p>
                </div>     
                <div class="col-sm-3">
                    <p>Posted graphical content into the blogs...</p>
                </div>     
                <div class="col-sm-2">
                    <p>12-3-23, 5:10PM</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-1">
                    <img :src="profilePicture" alt="Profile Picture" id="profile-picture"/>
                </div> 
                <div class="col-sm-2">
                    <p>Ching Chong Seng</p>
                </div>      
                <div class="col-sm-2">
                    <p>@wakakaka</p>
                </div>     
                <div class="col-sm-3">
                    <p>Posted graphical content into the blogs...</p>
                </div>     
                <div class="col-sm-2">
                    <p>12-3-23, 5:10PM</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/general/NavSidebar.vue';
export default {
    components: {
        NavSidebar,
    },
    data(){
        return{
            profilePicture: 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'
        }
    }
}
</script>

<style>
@import url('../../../styles/main.css');
#header{
    display: flex;
    flex-direction: row;
    background-color: #133B5B;
    padding: 30px 0 30px 0;
    min-height: 17vh;
    margin-left: -20px;
    justify-content: center;
}
#title{
    color: white;
    text-align: center;
    border-bottom: #EDEDED 1px solid;
    width: 45%;
}
#logs_header{
    display: flex;
    flex-direction: row;
    background-color: #EDEDED;
    padding: 50px 100px 50px 100px;
    height: 50px;;
    margin-left: -20px;
    justify-content: center;
}
#header_content{
    margin-bottom: 0px;
    font-weight: bold;
    margin-top: -12px;
}
#logs_content{
    display: flex;
    flex-direction: row;
    padding: 50px 100px 50px 100px;
    height: 50px;;
    margin-left: -20px;
    justify-content: center;
}
#profile-picture{
    border-radius: 50%;
    max-height: 58%;
    margin-left: -50px;
    margin-top: -36px;
}
#viewMoreButton{
    color: #E53A73;
    border: 2px solid #E53A73;
    background-color: white;
    font-weight: bold;
    border-radius: 5px;
}
</style>