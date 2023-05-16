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
                    <div class="col-md-6">
                        <h1 id="Name">Lee Ji Eun</h1>
                        
                    </div>
                </div>
                
            </div>
            <div id="right-content" class="col-md-3">

            </div>
        </div>
        
    </div>

</template>

<script>
import NavSidebar from '@/components/NavSidebar.vue'
import profilePicture from '@/assets/NgeeAnnLogo.png'
import banner from '@/assets/CustomBanner.png'

export default {
  components: {
    NavSidebar,
  },

  data(){
    return{
        banner: banner,
        profilePicture: profilePicture,
    }
  }

}

</script>

<style>
    body{
        margin: 0;
        padding: 0;
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
        border-radius: 50%;
        border: none;
        height: 142px;
        width: 142px;
        position: absolute;
        top: 30px;
        left: 115px;
    }

    #Name{
        display: flex;
        justify-content: center;
        margin-top: 15px;
        margin-left: 100px;
    }
</style>