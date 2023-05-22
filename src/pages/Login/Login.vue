<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-1">
                    <a href="/feed.html">
                        <span class="material-symbols-outlined" style="color: white; margin: 15px 0 0 15px">home</span>
                    </a>
                </div>
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" :draggable="isDraggable" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <h1>Log in</h1>
                        <input type="email" placeholder="Email Address" id="emailField" required>
                        <br/>
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" id="passwordField" required>
                        <button class="material-symbols-outlined overlay-button" :class="{ 'pressed': isPressed }" @click="hidePassword">visibility_off</button>
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
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
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
    transform: translatex(2.7vh);
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

input[type=text],
input[type=email],
input[type=password] {
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
    bottom: 20px; /* Adjust the distance from the bottom as needed */
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
.overlay-button {
    border: none;
    transform: translateX(-100%);
    background-color: transparent;
    background-repeat: no-repeat;
    cursor: pointer;
    outline: none;
}
.pressed {
    color: gray;
}
@keyframes gradientAnimation {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
<script>
export default {
        data() {
            return {
                isDraggable: false,
                isPressed: false,
                emailAddress: '',
                password: '',
                showPassword: false,
            }
        },
        methods: {
            hidePassword() {
                this.showPassword = !this.showPassword;
                this.isPressed = !this.isPressed;
            },
        },
    }
    
//document.getElementById('ngeeAnnBanner').setAttribute('draggable', false);
</script>

