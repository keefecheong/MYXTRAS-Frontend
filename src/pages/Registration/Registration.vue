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
                        <form @submit.prevent="login">
                            <h1>Register Now!</h1>
                            <input v-model="emailAddress" type="email" placeholder="Email Address" id="emailField" required>
                            <input v-model="phoneNumber" type="text" placeholder="Phone Number" id="numberField" @input="filterNumber" required>
                            <br>
                            <button id="sendOtpBtn">Send OTP</button>
                            <br>
                            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" id="passwordField" required>
                            <!-- :class="{ 'password-visible': showPassword }" -->
                            <button class="material-symbols-outlined overlay-button" :class="{ 'pressed': isPressed }" @click="hidePassword">visibility_off</button>
                            
                            <button @click="register()" id="registerBtn">
                                Register
                            </button>
                            <a href="/login.html" id="loginBtn">
                                Already have an account? Login Now!
                            </a>
                        </form>
                    </div>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </div>

</template>
  
<style>
@import url('../../styles/main.css');
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100vh;
    background-repeat: no-repeat;
    animation: gradientAnimation 2s infinite linear;
    background-size: 400% 400%;
    font-size: calc(.5em + 0.5vw) !important;
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
.whitebox {
    background-color: white;
    position: relative; /* for the register btn to stick to the bottom */
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
input[type=password],
input[type=email] {
  border: none;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(45deg,#FF6363, #E53A73);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 2px;
  margin-bottom: 30px;
  width: 80%;
  padding-bottom: 10px;
}
input:focus{
    background-size: 0% 2px;
    outline: none;
}

#sendOtpBtn {
    width: 6em;
    height: 2em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#sendOtpBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
}
#registerBtn {
    width: 10em;
    height: 3em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#registerBtn:hover {
    background: transparent;
    color: var(--primary);
    font-weight: bolder;
    border: solid;
    border-color: var(--primary);
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
.pressed {
    color: gray;
}
#loginBtn {
    color: black;
    text-decoration: none;
    position: absolute;
    bottom: 20px; /* Adjust the distance from the bottom as needed */
    left: 50%;
    transform: translateX(-50%);
}
#loginBtn::after {
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

#loginBtn:hover::after {
  transform: scaleX(1);
}
#loginBtn:hover{
    color: var(--primary);
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
            phoneNumber: '',
            password: '',
            showPassword: false,
        }
    },
    methods: {
        hidePassword() {
                this.showPassword = !this.showPassword;
                this.isPressed = !this.isPressed;
            },
        filterNumber() {
        // Remove any non-numeric characters except the minus sign at the beginning
        this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '').slice(0, 8);
        },
        register() {
            fetch("", {
                methods: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailaddress: this.emailAddress,
                    phonenumber: this.phoneNumber,
                    password: this.password,
                })
            });
            location.href = "/setupprofile.html";
        }
    },
}
</script>

