<!-- 
    layout to select interests/display current interests

    usage:
        props:
            selectedOption: pass an array of selected options to initialize which interests are already selected
        events:
            selectedInterests: returns the new array of selected interests
        slot:
            pass slot content for custom selection cue (see example) (default cue for profile selection)

    eg.
    to cue users to select interest tags for posts:
    <AddInterestButton
        :selectedOption="selectedOption"
        @selectedInterests="handleSelectedInterests"
    >
        Select tags for your post:   *displayed in place of original "What are you interested in?"
    </AddInterestButton>
 -->

<template>
    <div id="current-interests-container">
        <InterestBadgeList 
            :selectedOption="workingSelectedOption" 
            :selection="false"
            :maxWidth="'80%'"
            @interest-selected="handleSelection"
        />

        <!-- button to open popup -->
        <button type="button" class="btn" id="add-interest-plus-button" @click="() => togglePopup(true)">
            <span class="material-symbols-outlined">add_circle</span>
        </button>
    </div>

    <!-- popup to select interests -->
    <div v-if="showPopup" id="popup-container">
        <div>
            <button type="button" id="close-add-interest" class="material-symbols-outlined" @click="() => togglePopup(false)">Close</button>

            <div id="popup-content">
                <div id="selection-header">
                    <slot>What are you interested in?</slot>
                </div>

                <InterestBadgeList 
                    :selectedOption="workingSelectedOption" 
                    :selection="true"
                    @interest-selected="handleSelection"
                    style="margin-bottom: 15px"
                />

                <div id="button-container">
                    <button @click="clearSelection()" id="clear-all-btn">Clear All</button>
                    <button @click="confirmSelection()" id="confirm-btn">Confirm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InterestBadgeList from './InterestBadgeList.vue';
import handleSelectedInterests from '../../utils/general/defaultInterestSelectedCallback';

export default{
    props: [
        'selectedOption',
        'maxWidth'
    ],
    components: {
        InterestBadgeList
    },
    data(){
        return{
            showPopup: false,
            workingSelectedOption: []
        }
    },
    created() {
        // if there are existing options selected set workingSelectionOption to the existing values
        if (this.selectedOption.length > 0) {
            this.workingSelectedOption = this.selectedOption;
        }
    },
    emits: [
        'selectedInterests'
    ],
    methods:{
        // toggle interest selection popup
        togglePopup(show){
            this.showPopup = show;
        },
        // confirm selected interests and close popup
        confirmSelection() {
            this.$emit('selectedInterests', this.workingSelectedOption);
            
            this.togglePopup(false);
        },

        // clear the selected options
        clearSelection() {
            this.workingSelectedOption = [];
        },

        // add/remove selected interest
        handleSelection(option) {
            handleSelectedInterests(option, this.workingSelectedOption);
        }
    },
    
}

</script>

<style scoped>
#current-interests-container {
    display: flex;
    flex-direction: row;
}

#popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5) !important; /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

#popup-container > div {
    position: relative;
}

#close-add-interest {
    position: absolute;
    right: 15px;
    top: 15px;
    color: black;
}

#button-container {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
}

#confirm-btn, #clear-all-btn {
    width: 10em;
    color: white;
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
    border-radius: 10px;
    padding: 10px 12px;
}

#add-interest-plus-button{
    color: #E53A73;
    border: none;
    outline: none;
}

#add-interest-plus-button .material-symbols-outlined {
    color: inherit;
    scale: 1.3;
}

#popup-content {
    background-color: #fff;
    color: black;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
}

#selection-header {
    font-weight: bold;
    font-size: 1.2em;
}
</style>