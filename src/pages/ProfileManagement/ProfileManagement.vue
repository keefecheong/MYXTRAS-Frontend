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

        <div class="mb-3 row" id="position">
          <label for="inputInterest" class="col-md-1 offset-md-4 col-form-label">Interest: </label>
          <div class="col-sm-4">
            <div style="display: inline-block;">
              <span v-for="option in selectedOption" id="interest-badge" :class="getBadgeClass(option)">{{ option }}</span>
            </div>
            <button class="btn rounded-circle btn-sm" id="custom-btn" @click="handleClick"><i class="bi bi-plus"></i></button>

            <div v-if="showPopup" class="popup-container">
              <div class="popup-content">
                <h2>Popup Content</h2>
                <p>Choose something:</p>
                <button v-for="option in options" :class="getBadgeClass(option)" type="button" id="interest-badge" style="border-radius: 20px;" @click="handleChoice(option)">{{ option }}</button>

                <div class="button-container">
                  <button @click="cancelSelection">Cancel</button>
                  <button @click="confirmSelection()">Confirm</button>
                  <!-- <button @click="submitSelection">Submit</button> -->
                </div>
              </div>
            </div>
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

        <!-- <div class="name">
          <h1 style="font-size: 33px; justify-content: center; display: flex; margin: 20px;">Lee Ji Eun</h1>
        </div>

        <div class="username" style="margin: 30px;" id="profile">
          <label for="username">Username: @</label>
          <div style="flex-direction: column;">
            <input class="col-md-3" type="text" placeholder="Username" size="55">
          </div>
        </div>

        <div class="biography" style="margin: 30px;" id="profile">
          <p style="margin-right: 20px; margin-top: 10px;">Bio: </p>
          <div style="flex-direction: column;">
            <input class="col-md-3" type="text" placeholder="Biography" size="55">
          </div>
        </div>

        <div class="interests" style="margin: 30px;" id="profile">
          <p style="margin-right: 20px; margin-top: 10px;">Interests: </p>
          <input type="text" placeholder="Interests" size="55">
        </div>

        <div style="margin: 30px;" id="profile">
          <div class="warningbox">
            <p><b>Personal Information</b> - This will only be recorded for user analytics. This will not be shown to the public.</p>
          </div>
        </div>

        <div class="gender" style="margin: 30px;" id="profile">
          <p style="margin-right: 20px; margin-top: 10px;">Gender: </p>
          <input class="col-md-3" type="text" placeholder="Gender" size="55">
        </div>

        <div class="email" style="margin: 30px;" id="profile">
          <p style="margin-right: 20px; margin-top: 10px;">Secondary Email: </p>
          <input class="col-md-3" type="text" placeholder="Secondary Email" size="55">
        </div>

        <div class="submitbutton" style="margin: 30px;" id="profile">
          <button class="submit-button">Get Started!</button>
        </div> -->

      </div>
        
    </div>
    
  </template>

  
<script>
import NavSidebar from '@/components/NavSidebar.vue'
import ngeeann from '@/assets/NgeeAnnLogo.png'
import banner from '@/assets/CustomBanner.png'

export default {
  components: {
    NavSidebar,
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
      options:[
        'Kpop',
        'Games',
        'Technology',
        'Sports',
        'Dancing',
        'JPOP',
        'Coding',
        'Lifestyle'
      ],
    }
  },

  methods:{
    handleClick(){
            console.log("CLicked");
            this.showPopup = true;
        },

    handleChoice(option){
        console.log(option);
        const index = this.selectedOption.indexOf(option);
        if (this.selectedOption.includes(option)) {
            // Option is already selected, remove it from the array
            this.selectedOption = this.selectedOption.filter(item => item !== option);
        } else {
            // Option is not selected, add it to the array
            this.selectedOption.push(option);
        }
//         this.selectedOption = option;
//         this.showPopup = false;
    },

    cancelSelection(){
        this.selectedOption = [];
        this.showPopup = false;
    },

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

    confirmSelection() {
            // Perform any necessary actions with the selected options here
            console.log("Selected options:", this.selectedOption);
            this.showPopup = false;
        },

        getBadgeClass(option) {
            // Return a class name based on the selected option
            switch (option) {
            case 'Kpop':
                return 'badge badge-kpop';
            case 'Games':
                return 'badge badge-games';
            case 'Technology':
                return 'badge badge-technology';
            case 'Sports':
                return 'badge badge-sports'
            case 'Dancing':
                return 'badge badge-dancing'
            case 'JPOP':
                return 'badge badge-jpop'
            case 'Coding':
                return 'badge badge-coding'
            case 'Lifestyle':
                return 'badge badge-lifestyle'
            }
            return `badge-${bg-info}`;
        },
  },
}
</script>

<style>
    body{
      margin: 0;
      padding: 0;
    }

    .popup-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

    .button-container {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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
      border-color: #E53A73;
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

    #custom-btn{
      color: #E53A73;
      border-color: #E53A73; 
      border-width: 2px;
      margin-left: 10px;
    }

    #interest-badge{
      margin: 5px;
      padding: 10px;
    }

    .badge-kpop {
    background-color: #FF7BE2;
}

.badge-games {
    background-color: #6FE5FF;
}

.badge-technology {
    background-color: #6FFFA8;
}

.badge-sports{
    background-color: #FFE27B;
}

.badge-dancing{
    background-color: #7B88FF;
}

.badge-jpop{
    background-color: #FFAB6F;
}

.badge-coding{
    background-color: #6F74FF;
}

.badge-lifestyle{
    background-color: #FC5454;
}

</style>