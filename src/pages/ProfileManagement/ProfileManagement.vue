<template>
  
    <div id="main-container">
      <NavSidebar />
      <div id="main-content">
        <div class="banner">
          <img :src="banner" alt="Banner" id="banner-picture"/>
            <div class="content">
              <input ref="bannerInput" type="file" @change="upload($event, 'banner')" style="display: none">
              <button class="banner-button"  @click="chooseFile('banner')">Customize banner</button>
            </div>
        </div>

        <div class="profilepicture">
          <div class="content">
            <div class="image-container">
              <img :src="profilePicture" alt="Profile Picture"  id="profile-picture"/>
            </div>
            <input ref="fileInput" type="file" @change="upload($event, 'profilePicture')" style="display: none">
            <button class="profile-button" @click="chooseFile('profilePicture')">Change Profile Picture</button>  
          </div>
        </div>

        
        <div class="mb-3 row" id="position">
          <label for="inputUsername" class="col-md-1 offset-md-4 col-form-label">Username: @</label>
          <div class="col-sm-4">
            <input type="username" class="form-control" id="inputUsername" placeholder="Username">
          </div>
        </div>

        <div class="mb-3 row" id="position">
          <label for="inputBio" class="col-md-1 offset-md-4 col-form-label">Bio: </label>
          <div class="col-sm-4">
            <input type="biography" class="form-control" id="inputBio" placeholder="Biography">
          </div>
        </div>

        <div class="mb-3 row" id="position" >
          <label for="inputInterest" class="col-md-1 offset-md-4 col-form-label">Interest: </label>
          <div class="col-sm-4">
            <AdditionButton/>          
          </div>
        </div>
          

        <div style="margin: 30px;" id="profile">
          <div class="warningbox col-md-4 offset-md-1">
            <p><b>Personal Information</b> - This will only be recorded for user analytics. This will not be shown to the public.</p>
          </div>
        </div>

        <div class="mb-3 row" id="position">
          <label for="inputGender" class="col-md-1 offset-md-4 col-form-label">Gender: </label>
          <div class="col-sm-4">
            <input type="gender" class="form-control" id="inputGender" placeholder="Gender">
          </div>
        </div>

        <div class="mb-3 row" id="position">
          <label for="inputEmail" class="col-md-1 offset-md-4 col-form-label">Secondary Email: </label>
          <div class="col-sm-4">
            <input type="email" class="form-control" id="inputEmail" placeholder="Email">
          </div>
        </div>

        <div class="submitbutton" style="margin: 30px;" id="profile">
          <button class="submit-button">Get Started!</button>
        </div>
      </div>
        
    </div>
    
  </template>

  
<script>
import NavSidebar from '../../components/NavSidebar.vue'
import AdditionButton from '../../components/AdditionButton.vue'
import ngeeann from '../../assets/NgeeAnnLogo.png'
import banner from '../../assets/CustomBanner.png'

export default {
  components: {
    NavSidebar,
    AdditionButton,
    ngeeann,
    banner,
  },

  data() {
    return {
      showPopup: false,
      selectedOption: [],
      profilePicture: ngeeann,
      banner: banner,
      // selectedBanner: "banner",
      // selectedProfilePic: "profilePicture",
    }
  },

  methods:{
    chooseFile(imageType){
      console.log(imageType);
      if (imageType === "profilePicture") {
        this.$refs.fileInput.click();
      } 
      else {
        this.$refs.bannerInput.click();
      }
    },

    upload(event, imageType){
      console.log(imageType);
      const file = event.target.files[0];
      if (imageType === "profilePicture"){
        this.profilePicture = URL.createObjectURL(file);
      }
      else{
        this.banner = URL.createObjectURL(file);
      }
      
    },
  },
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

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .banner-button {
      background-color: #E53A73;
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      font-size: 10px;
      border-radius: 10px;
      margin-top: 50px;
      font-weight: bold;
      position: absolute;
      top: 85px;
    }

    .profile-button {
      background-color: transparent;
      color: #E53A73;
      padding: 10px 20px;
      text-align: center;
      font-size: 10px;
      border-radius: 10px;
      position: absolute;
      top: 355px;
      font-weight: bold;
      border: 2px solid #E53A73;
    }

    .submit-button {
      background-color: #E53A73;
      border: none;
      color: white;
      padding: 20px 50px;
      text-align: center;
      font-size: 13px;
      border-radius: 10px;
      margin-top: 50px;
      font-weight: bold;
    }

    #profile-picture {
      margin: 30px auto;
      text-align: center;
      display: block;
      margin-top: 78px;
      border-radius: 50%;
      border: 1px solid black;
      height: 142px;
      width: 142px;
    }

    #profile{
      margin: 20px;
      justify-content: center; 
      display: flex;
      align-items: center;
    }

    .warningbox{
      background-color: #686868; 
      border: none;
      color: white;
      border-radius: 10px;
      padding: 20px;
      font-size: 15px;
    }

    #position{
      margin: 50px 0px; 
    }

</style>