<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10 loginContainer">
                    <img src="../../assets/ngeeannxtras.jpg" id="ngeeAnnBanner">
                    <div class="whitebox">
                        <h1>Register Now!</h1>
                        <input type="text" placeholder="Email Address" id="emailField" class="inputField">
                        <input type="text" placeholder="Phone Number" id="numberField" class="inputField">
                        <Dropdown
                            :options="[{ id: 1, name: 'Option 1'}, { id: 2, name: 'Option 2'}]"
                            v-on:selected="validateSelection"
                            v-on:filter="getDropdownValues"
                            :disabled="false"
                            name="zipcode"
                            :maxItem="10"
                            placeholder="Please select an option">
                        </Dropdown>
                        <input type="text" placeholder="Discipline" id="disciplineDropdown" class="inputField">
                        <input type="text" placeholder="Password" id="passwordField" class="inputField">
                        <button class="material-symbols-outlined overlay-button" @click="">visibility_off</button>
                        <button @click="" id="registerBtn">
                            Register
                        </button>
                        <br>
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

.inputField {
    margin-bottom: 30px;
    width: 80%;
}
.buttonContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#registerBtn {
    width: 10em;
    height: 3em;
    color: white;
    margin-top: 5vh;
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
}

.inputField {
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
import Dropdown from 'vue-simple-search-dropdown';

export default {
        data() {
            return {
                
            }
        },
    }
    
//document.getElementById('ngeeAnnBanner').setAttribute('draggable', false);
</script>

