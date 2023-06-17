<template>
    
        <div id="interest-badges">
            
            <span v-for="option in selectedOption" id="interest-badge" :class="[getBadgeClass(option), { 'selected': selectedButton === option }]">{{ option }}</span>
            
        </div>
        <button type="button" class="btn rounded-circle btn-sm" id="custom-btn" @click="handleClick"><i class="bi bi-plus"></i></button>
        

    <div v-if="showPopup" class="popup-container">
        <div class="popup-content align">
            <h2>Interests</h2>
            <p>Please select the interest(s) that suit you best:</p>
            <button v-for="option in options" :class="[getBadgeClass(option), { 'selected': selectedButton === option }]" type="button" id="interest-badge" style="border-radius: 20px;" @click="handleChoice(option)">{{ option }}</button>

            <div class="button-container">
            <button @click="confirmSelection()" id="confirmBtn">Confirm</button>

            </div>
        </div>
    </div>

</template>

<script>
export default{
    props: {
        selectedOption: {
            type: Array,
            default: () => [],
        },
    },

    data(){
        return{
            showPopup: false,
            selectedButton: null,
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
            this.showPopup = true;
        },
        handleChoice(option){
            // const index = this.selectedOption.indexOf(option);
            // if (this.selectedOption.includes(option)) {
            //     // Option is already selected, remove it from the array
            //     this.selectedOption = this.selectedOption.filter(item => item !== option);
            //     this.selectedButton = null;
            // } else {
            //     // Option is not selected, add it to the array
            //     this.selectedOption.push(option);
            //     this.selectedButton = option;
            // }
            const index = this.selectedOption.indexOf(option);
            if (index > -1) {
                // Option is already selected, remove it from the array
                this.selectedOption.splice(index, 1);
                this.selectedButton = null; // Reset the selectedButton
            } else {
                // Option is not selected, add it to the array
                this.selectedOption.push(option);
                this.selectedButton = option; // Set the selectedButton
            }
        },

        confirmSelection() {
            // Perform any necessary actions with the selected options here
            this.$emit('selectedInterests', this.selectedOption);
            this.showPopup = false;
        },
        
        getBadgeClass(option) {
            if (this.selectedOption.includes(option)) {
                return `badge ${this.getBadgeColor(option)} selected`;
            }
            return `badge ${this.getBadgeColor(option)}`;
        },

        getBadgeColor(option) {
            // Return a class name based on the selected option
            return 'badge badge-' + option.toLowerCase();
        },
    }
}

</script>

<style scoped>

.align{
    text-align: center;
}

#confirmBtn{
    width: 10em;
    color: white;
    margin-top: 50px;
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
    border-radius: 10px;
    padding: 10px 12px;
}

#interest-badge{
    margin: 5px;
    padding: 10px;
}

.interest-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}


#custom-btn{
    color: #E53A73;
    border-color: #E53A73; 
    border-width: 2px;
    margin-left: 10px;
}

.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5) !important; /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
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

.selected {
    border: 3px solid;
}

</style>