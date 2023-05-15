<template>
  
    <div id="main-container">
      <NavSidebar />
      <div id="main-content">
        <div class="banner">
            <div class="content">
              <p>{{ message }}</p>
            <!--div class="button-container"-->
              <button class="banner-button">Customize banner</button>
            <!--/div-->
            </div>
        </div>

        <div class="profilepicture">
          <div class="content">
            <img src="../../assets/NgeeAnnLogo.png" alt="Ngee Ann Polytechnic Logo" id="ngee-ann-logo"/>   
            <button class="profile-button">Change Profile Picture</button>  
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
            <span class="badge bg-primary">Primary</span>
            <span class="badge bg-secondary">Secondary</span>
            <span class="badge bg-success">Success</span>
            <button class="btn rounded-circle custom-btn"><i class="bi bi-plus"></i></button>
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

export default {
  components: {
    NavSidebar
  },

  data() {
    return {
      message: 'Awesome background'
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
      height: 100px;
      width: 100%;
      background-color: #f1f1f1;
      color: #333;
      margin: 0;
      padding: 0;
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
    }

    .profile-button {
      background-color: transparent;
      color: #E53A73;
      padding: 10px 20px;
      text-align: center;
      font-size: 10px;
      border-radius: 10px;
      position: absolute;
      top: 260px;
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

    #ngee-ann-logo {
      margin: 30px auto;
      text-align: center;
      display: block;
      margin-top: 30px;
      border-radius: 50%;
      border: 1px solid black;
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

    .custom-btn{
      background-color: red;
      color: #E53A73;
    }

</style>