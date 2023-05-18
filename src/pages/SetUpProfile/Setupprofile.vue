<template>
    <div id="main-container">
        <div id="main-content">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 whitebox">
                    <h2 id="header">Set up your profile</h2>
                    <input type="text" placeholder="Name" id="nameField" v-model="realname">
                    <input type="text" placeholder="Bio" id="bioField" >
                    <p>Interests: </p>
  
                    <div class="text-center">
                        <v-select
                            v-model="discipline"
                            :items="disciplines"
                            label="Discipline"
                        ></v-select>
                    </div>
                    <div class="text-center">
                        <v-select
                            v-model="course"
                            :items="courses"
                            label="Course"
                        ></v-select>
                    </div>
                    <!-- <select v-model="discipline">
                        <option disabled value="">Select a discipline</option>
                        <option v-for="disciplineOption in disciplineOptions" :value="disciplineOption" :key="disciplineOption">{{ disciplineOption }}</option>
                    </select>
                    <select v-model="course">
                        <option disabled value="">Select a course</option>
                        <option v-for="courseOption in courseOption" :value="courseOption" :key="courseOption">{{ courseOption }}</option>
                    </select> -->
                    <p class="warning">Warning - Discipline and course cannot be modified! Ensure that</p>
                    <p class="warning">you choose the most accurate description of your course of study</p>
                    <button @click="checkDetails()" id="getStartedBtn">
                        Get Started
                    </button>

                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </div>
</template>

<style>
body {
    background: linear-gradient(45deg,#FF6363, #E53A73);
    height: 100%;
    background-repeat: no-repeat;
    font-size: calc(.5em + 0.5vw) !important;
}
.whitebox {
    background-color: white;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 5vh !important;
    padding: 10vh 0;
}

input[type=text]{
  border: none;
  border-bottom: 2px solid transparent;
  background-image: linear-gradient(45deg,#FF6363, #E53A73);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 100% 2px;
  margin-bottom: 30px;
  width: 80%;
  padding-bottom: 10px;
  appearance: none;
}

input:focus {
    background-size: 0% 2px;
    outline: none;
}

#header{
    margin-bottom: 60px;
}

.warning{
    color: #FF0000;
    font-size: 12px;
}

.v-select {
    width: 100%;
}

#getStartedBtn {
    width: 10em;
    color: white;
    margin-top: calc(.5em + 0.1vw);
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
    border-radius: 10px;
    padding: 20px 25px;
}

</style>

<script>
import DropDown from '@/components/DropDown.vue'

export default {
    components: {
        DropDown,
  },

    data() {
        return {
            realname: "",
            username: "",
            disciplineOptions: ["Computer Science", "Engineering", "Mathematics"],
            courseOption: ["Cybersecurity and Digital Forensics", "Biomedical Sceince", "Data Science", "Immersive Media"],
            disciplines: [
                'ICT',
                'BA',
                'DE',
                'LSCT',
                'Engineering',
            ],
            discipline: 'Please Select a Discipline',
            courses: [
                'Cybersecurity and Digital Forensics',
                'Immersive Media',
                'Data Science',
                'Information Technology',
                'Business Studies',
            ],
            course: 'Please Select a course',
        };
    },
}
</script>