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
              <img :src="profilePicture" alt="Profile Picture"  id="profile-picture" ref="cropperImage"/>
            </div>
            <input ref="fileInput" type="file" @change="upload($event, 'profilePicture')" style="display: none">
            <button v-if="!showBtn" class="profile-button" @click="chooseFile('profilePicture')">Change Profile Picture</button>
            <button v-if="showBtn" class="confirm-button" @click="confirmCropping">Confirm Crop</button>
          </div>
        </div>

        
        <div class="mb-3 row" id="position">
          <label for="inputUsername" class="col-md-1 offset-md-4 col-form-label">Username: @</label>
          <div class="col-sm-4">
            <input type="username" v-model="username" class="form-control" id="inputUsername" placeholder="Username">
          </div>
        </div>

        <div class="mb-3 row" id="position">
          <label for="inputBio" class="col-md-1 offset-md-4 col-form-label">Bio: </label>
          <div class="col-sm-4">
            <input type="biography" v-model="biography" class="form-control" id="inputBio" placeholder="Biography">
          </div>
        </div>

        <div class="mb-3 row" id="position" >
          <label for="inputInterest" class="col-md-1 offset-md-4 col-form-label">Interest: </label>
          <div class="col-sm-4">
            <AddInterestButton :selectedOption="selectedOption"/>
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
            <input type="gender" v-model="gender" class="form-control" id="inputGender" placeholder="Gender">
          </div>
        </div>

        <!-- <div class="mb-3 row" id="position">
          <label for="inputEmail" class="col-md-1 offset-md-4 col-form-label">Secondary Email: </label>
          <div class="col-sm-4">
            <input type="email" v-model="secondaryEmail" class="form-control" id="inputEmail" placeholder="Email">
          </div>
        </div> -->

        <div class="submitbutton" style="margin: 30px;" id="profile">
          <button class="submit-button" @click="updateProfile()">Get Started!</button>
        </div>
      </div>
        
    </div>
    
  </template>

  
<script>
import NavSidebar from '../../components/general/NavSidebar.vue'
import AddInterestButton from '../../components/general/AddInterestButton.vue'
import ngeeann from '../../assets/NgeeAnnLogo.png'
import banner from '../../assets/CustomBanner.png'
import Cropper from 'cropperjs';


export default {
  components: {
    NavSidebar,
    AddInterestButton,
    Cropper,
    ngeeann,
    banner,
  },

  data() {
    return {
      showPopup: false,
      selectedOption: [],
      cropper: null,
      profilePicture: ngeeann,
      banner: banner,
      username: '',
      biography: '',
      gender:'',
      // secondaryEmail: '',
      showBtn: false,
      // selectedBanner: "banner",
      // selectedProfilePic: "profilePicture",
    }
  },

  mounted() {
        this.checkAuth();
  },

  methods:{
    checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.is_profile_setup === false){
                            window.location.href = '/setupprofile.html';
                            return;
                        }
                        else {
                            this.username = data.username;
                            this.biography = data.biography;
                            this.selectedOption = data.interests;
                            this.gender = data.gender;
                            this.userId = data._id;
                            this.profilePicture = data.profile_pic_link;
                        }
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                    })
                .catch(error => {
                    console.error('Error:', error);
                });
        },

    initializeCropper() {
        const imageElement = this.$refs.cropperImage;
        this.cropper = new Cropper(imageElement, {
          aspectRatio: 1, // Set the aspect ratio for the cropped image
          viewMode: 1, // Restrict the cropping area to the container size
          dragMode: 'move', // Allow dragging the image within the container
          cropBoxResizable: true, // Disable resizing of the cropping area
          cropBoxMovable: true, // Disable moving of the cropping area
          toggleDragModeOnDblclick: true, // Disable toggling drag mode on double-click
          autoCropArea: 0.5, // Set the initial cropping area to a circle
          guides: false, // Hide the grid lines
          background: false, // Disable the background overlay
          ready: () => {
            this.cropper.setCropBoxData({
              width: 142,
              height: 142,
              left: (imageElement.offsetWidth - 142) / 2,
              top: (imageElement.offsetHeight - 142) / 2,
            });
          },
        });
    },

    chooseFile(imageType){
      console.log(imageType);
      if (imageType === "profilePicture") {
        this.$refs.fileInput.value = ''; // Reset the file input value
        this.$nextTick(() => {
          this.$refs.fileInput.click(); // Open the file input dialog
        });
      } else {
        this.$refs.bannerInput.click();
      }
    },

    upload(event, imageType){
      console.log(imageType);
      const file = event.target.files[0];
      // if (imageType === "profilePicture"){
      //   this.profilePicture = URL.createObjectURL(file);
      // }
      // else{
      //   this.banner = URL.createObjectURL(file);
      // }

      if (imageType === 'profilePicture') {
        this.profilePicture = URL.createObjectURL(file);
        this.showBtn = true;
        this.$nextTick(() => {
          this.initializeCropper();
        });
      } else {
        this.banner = URL.createObjectURL(file);
      }
      
    },

    confirmCropping() {
      const croppedCanvas = this.cropper.getCroppedCanvas({
        width: 142,
        height: 142,
        fillColor: '#fff',
      });
      const croppedImage = croppedCanvas.toDataURL(); // Get the cropped image as a data URL
      this.profilePicture = croppedImage;
      this.cropper.destroy(); // Destroy the cropper instance
      this.cropper = null; // Set the cropper variable to null
      this.showBtn = false;
    },
 
    // async updateProfile() {
      
    //   this.userObject = {
    //     'userName': this.username,
    //     'biography': this.biography,
    //     'selectedInterests': this.selectedOption,
    //     'gender': this.gender
    //   }

      
    //   fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`, {
    //       method: 'PATCH', 
    //       headers: {
    //           'Content-Type': 'application/json; charset=UTF-8',
    //       },
    //       body: JSON.stringify(this.userObject),
    //       credentials: "include",
    //   }) .then(response => {
    //           if (!response.ok) {
    //               throw new Error('Error: ' + response.status);
    //           } else {
    //               window.location.href = '/profilePage.html';
    //           }
    //       })
    //       .catch(error => {
    //           console.error('Error:', error);
    //       });
          
    //   // console.log(this.userObject);
    // },
    async updateProfile(){
      var formData = new FormData();

      this.userObject = {
        'userName': this.username,
        'biography': this.biography,
        'selectedInterests': this.selectedOption,
        'gender': this.gender,
        // 'profilePicture': this.$refs.fileInput.files[0],
        
      };
      console.log(this.userObject);
      formData.append('userObject', JSON.stringify(this.userObject));

      formData.append('selectedImages', this.$refs.fileInput.files[0]);


      // console.log(this.username);
      // formData.append('userName', this.username);
      // console.log(formData);

      // formData.append('biography', this.biography);
      // formData.append('selectedInterests', JSON.stringify(this.selectedOption));
      // formData.append('gender', this.gender);
      // formData.append('profilePicture', this.$refs.fileInput.files[0]);
      try{
        const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/profile`,{
          method: 'PATCH',
          body: formData,
          credentials: 'include',
        });

        if (response.ok){
          window.location.href = '/profilePage.html';
        }else{
          console.log('Error:', response.statusText);
        }
      }
      catch (error){
        console.log('Error:', error);
      }
    }

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
      width: 101%;
      margin-left: -1%;

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

    .confirm-button{
      background-color: transparent;
      color: #E53A73;
      padding: 10px 20px;
      text-align: center;
      font-size: 10px;
      border-radius: 10px;
      position: absolute;
      margin-top: 235px;
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

    .cropper-crop-box, .cropper-view-box {
      border-radius: 50%;
    }

    .cropper-view-box {
      box-shadow: 0 0 0 1px #39f;
      outline: 0;
    }

    .cropper-modal{
      height: 75%;
      margin-top: 25px;
    }

    

</style>