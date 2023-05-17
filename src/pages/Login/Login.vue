<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <h1>Log in</h1>
                        <input type="text" placeholder="Email Address" id="emailField">
                        <br/>
                        <input type="text" placeholder="Password" id="passwordField">
                        <button class="material-symbols-outlined overlay-button" @click="">visibility_off</button>
                        <br/>
                        <button @click="" id="loginBtn">
                            Log in
                        </button>
                        <br>
                        <a href="/registration.html" id="registerBtn">
                            Don't have an account? Register Now!
                        </a>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </div>
    <!-- https://vuejs.org/guide/essentials/component-basics.html#listening-to-events -->
</template>
  
<style>
@import url('../../styles/main.css');
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100vh;
    background-repeat: no-repeat;
    overflow: hidden;
}
h1 {
    margin-bottom: 5vh !important;
}
#ngeeAnnBanner {
    opacity: 0.75;
    width: 100%;
    height: 100%;
}
.loginContainer {
    border-radius: 1000px !important;
    margin-top: 11vh !important;
}
#emailField {
    margin-bottom: 20px;
    width: 80%;
}
#passwordField{
    margin-bottom: 20px;
    width: 80%;
}
.whitebox {
    background-color: white;
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

}
#ngeeAnnBanner,
.whitebox {
    display:inline-block;
    width:50%;  
    vertical-align:middle;
}

input[type=text] {
  border: none;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(45deg,#FF6363, #E53A73);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 2px;
}
input:focus{
    background-size: 0% 2px;
    outline: none;
}

.buttonContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#loginBtn {
    width: 10em;
    height: 3em;
    color: white;
    margin-top: 5vh;
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#loginBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#registerBtn {
    color: black;
    text-decoration: none;
    position: absolute;
    bottom: 15px; /* Adjust the distance from the bottom as needed */
    left: 50%;
    transform: translateX(-50%);
}
#registerBtn::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(45deg,#FF6363, #E53A73);
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

#registerBtn:hover::after {
  transform: scaleX(1);
}
#registerBtn:hover{
    color: var(--primary);
}
#emailField,
#passwordField {
    padding-bottom: 10px;
}
#passwordField {
    transform: translatex(2.7vh);
}
.overlay-button {
    border: none;
    transform: translateX(-100%);
    background-color: transparent;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
}
</style>
<script>
export default {
        data() {
            return {
                
            }
        },
    }
    
//document.getElementById('ngeeAnnBanner').setAttribute('draggable', false);
</script>

