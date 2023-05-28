<template>
  
    <div id="main-container">
        <NavSidebar />
        <div id="main-content" class="mb-3 row">
            <div id="left-content" class="col-md-9">
                <div class="banner">
                    <img :src="banner" alt="Banner" id="banner-picture"/>
                </div>

                <div class="image-container">
                    <img :src="profilePicture" alt="Profile Picture"  id="profile-picture"/>
                </div>


                <div id="header-content" class="mb-3 row">
                    <div class="col-md-8" style="margin-top: 30px;">
                        <h1 id="Name" style="display: inline;">Lee Ji Eun</h1>
                        <p style="display: inline-block; margin-left: 20px; font-size: 20px;">@IU</p>
                        <p style="margin-left: 200px;">School of ICT - Diploma in Cybersecurity and Digital Forensics</p>
                        <p style="margin-left: 200px;">I am 19 years old and I live by the motto, "live, laugh, love"</p>
                        <span class="badge bg-primary" id="interest-badge" style="margin-left: 200px">
                            {{ interests[0].label }}
                        </span>
                        <span v-for="interest in interests.slice(1)" :key="interest.label" :class="`badge ${interest.class}`" id="interest-badge">
                            {{ interest.label }}
                        </span>
                    </div>

                    <div class="col-md-2 offset-md-2" style="margin-top: 30px;">
                        <a href="/profileManagement.html">
                            <h3 style="margin-left: 100px; color: black;"><i class="bi bi-pencil"></i></h3>
                        </a>
       
                        <div id="signOutContainer" style="display: flex; align-items: center; margin-left: 50px; margin-top: 31px; color: #dd1217" @click="signOut()">
                            <h6><i class="bi bi-box-arrow-right" style="margin-left: 2px;"></i></h6>
                            <h6 style="margin-left: 15px; margin-top:-1px;"><b>Sign out</b></h6>
                        </div>
                    </div>
                    
                </div>

                <div class="mb-3 row">
                    <div class="col-md-6" v-for="image in images" :key="image">
                        <img class="blog-image" :src="image">
                    </div>
                </div>    
                <div class="content-wrapper">
                    <div class="floating-button" @click="createBlog">
                        <i style="color: white" class="bi bi-plus plus-icon"></i>
                    </div>
                </div>         
            </div>

            <div id="right-content" class="col-md-3">
                <div class="card follower-card" style="height: 350px;">
                    <div class="card-body card-position">
                        <h5 class="card-title">Followers: {{ followers.length }}</h5>
                        <div v-for="follower in followers" :key="follower.username">
                            <br>
                            <img class="profilepic" :src="follower.profilePic">
                            <p class="follower-username">{{ follower.username }}</p>
                            <br>
                        </div>
                        <!-- <h5 class="card-title">Followers: 2</h5>
                        <br>
                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        <p class="follower-username">John</p>
                        <br>
                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        <p class="follower-username">Temp</p>
                        <br> -->
                        <h4><i class="bi bi-three-dots three-dots"></i></h4>
                    </div>
                </div>

                <div class="card forums-card" style="height:500px">
                    <div class="card-body card-position">
                        <h5 class="card-title">Joined Forums:</h5>
                            <div v-for="forum in forums" :key="forum.name">
                                <br>
                                <img class="profilepic" :src="forum.profilePic">
                                <p class="forum-name">{{ forum.name }}</p>
                                <p class="forum-description">{{ forum.description }}</p>
                                <br>
                            </div>
                        <!-- <h5 class="card-title">Joined Forums:</h5>
                        <br>
                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        <p class="forum-name">ILUVCats</p>
                        <p class="forum-description">We talk about cats</p>
                        <br>
                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        <p class="forum-name">muggingclub</p>
                        <p class="forum-description">Gind never stops!</p>
                        <h4><i class="bi bi-three-dots three-dots"></i></h4>
                        <br>
                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        <p class="forum-name">muggingclub</p>
                        <p class="forum-description">Gind never stops!</p> -->
                        <h4><i class="bi bi-three-dots three-dots"></i></h4>
                    </div>
                </div>
            </div>
        </div>
        
    </div>

</template>

<script>
import NavSidebar from '../../components/NavSidebar.vue'
import profilePicture from '../../assets/NgeeAnnLogo.png'
import banner from '../../assets/CustomBanner.png'

export default {
  components: {
    NavSidebar,
  },

  data(){
    return{
        banner: banner,
        profilePicture: profilePicture,
        interests: [
            { label: 'Kpop', class: 'bg-primary' },
            { label: 'Games', class: 'bg-secondary' },
            { label: 'Technology', class: 'bg-success' }
      ],
        images: [
            'https://pbs.twimg.com/profile_images/1655527977478946818/Z-Fu2b-P_400x400.jpg',
            'https://qph.cf2.quoracdn.net/main-qimg-6ba09fb44474d45efc83c2471487969d-lq'
        ],
        followers: [
            { username: 'John', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png' },
            { username: 'Temp', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png' }
        ],
        forums: [
            { name: 'ILUVCats', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'We talk about cats' },
            { name: 'muggingclub', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'Gind never stops!' },
            { name: 'muggingclub', profilePic: 'https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png', description: 'Gind never stops!' }
      ],
    }
  },
  methods:{
    redirectlogin(){
        fetch("http://127.0.0.1:8081/api/users/redirect-login", {
                method: 'GET',
            }) .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    console.log("Error: Failed to log out (Redirect failure)")
                    console.log(response)
                }
            });
    },
    signOut(){
        console.log("1")
        fetch("http://127.0.0.1:8081/api/users/remove-cookie", {
                method: 'GET',
                mode: "cors",
                credentials: 'include'
            }) .then(response => {
                if (response.ok) {
                    this.redirectlogin()
                } else {
                    console.log("Error: Failed to log out (Remove cookie)")
                    console.log(response)
                }
            });
    },
  }

}

</script>

<style>
    body{
        margin: 0;
        padding: 0;
    }
    #signOutContainer:hover {
        cursor: pointer !important;
    }
    .banner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 150px;
        width: 100%;
        background-color: #f1f1f1;
    }

    #banner-picture{
        height: 150px;
        width: 100%;
    }

    #right-content{
        background-color: #E53A73;
    }

    #profile-picture {
        margin: 30px auto;
        text-align: center;
        display: block;
        margin-top: 78px;
        margin-left: 30px;
        border-radius: 50%;
        border: none;
        height: 142px;
        width: 142px;
        position: absolute;
        top: 30px;
    }

    #Name{
        display: flex;
        justify-content: center;
        margin-left: 200px;
    }

    #header-content{
        height: 225px;
        width: 100%;
       
        margin-left: 0px;
    }

    #interest-badge{
        margin: 5px;
        margin-right: 20px;
        padding: 10px 15px;
    }

    .blog-image {
        border-radius: 3%;
        /* height: 365px; */
        width: 100%;
    }

    .follower-card{
        margin-top: 55px;
    }

    .forums-card{
        margin-top: 55px;
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

    .follower-username{
        margin-top: 30px;
    }

    .three-dots{
        position: absolute; 
        bottom: 0;
        margin-left: 5px;
        margin-bottom: 15px;
    }
    .card-position{
        height: 100%;
        position: relative;
    }

    .forum-name{
        margin-top: 25px;
        font-family: Quicksand;
        font-weight: lighter;
    }

    .forum-description{
        margin-top: -20px;
        font-weight: Quicksand;
        font-weight: medium;

    }

    #main-container {
        position: relative;
        min-height: 100vh;
    }

    #left-content {
        position: relative;
    }

    .content-wrapper {
        position: sticky;
        bottom: 20px;
        right: 20px;
        display: flex;
        justify-content: flex-end;
        z-index: 1;
    }

    .floating-button {
        background-color: #E53A73;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .plus-icon{
        font-size: 24px;
    }





</style>