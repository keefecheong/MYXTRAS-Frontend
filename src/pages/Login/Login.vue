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
                        <div class="underline"></div>
                        <br/>
                        <input type="text" placeholder="Password" id="passwordField">
                        <span class="material-symbols-outlined overlay-button">visibility_off</span>
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

</template>
  
<style>
@import url('../../styles/main.css');
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100vh;
    background-repeat: no-repeat;
    overflow: hidden;
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

.material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    color: black;
    transform: translateX(-100%);

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
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}
#registerBtn {
    border: none;
    background-color: white;
}
#registerBtn:hover{
    border-bottom: #E53A73;
}
#emailField,
#passwordField {
    padding-bottom: 10px;
}
#passwordField {
    transform: translatex(2.3%);
}

</style>
<script>
export default {
        data() {
            return {
                
            }
        },
    }
    
// document.getElementById('ngeeAnnBanner').setAttribute('draggable', false);
</script>

