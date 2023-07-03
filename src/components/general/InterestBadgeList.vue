<!-- 
    layout for displaying interest options

    usage:
        props:
            selectedOption: pass an array of selected options to initialize which interests are selected
            selection: pass true/false:
                true - list all options for selection
                false - list currently selected options
            maxWidth: to set max width on interest list (useful if interest list gets too long)
        events:
            interest-selected: returns the new selected/removed option
    
    eg.
    to list all interests for selection
    <InterestBadgeList
        :selectedOption="selectedOption"
        :selection="true"
        @interest-selected="handleInterestSelected"
    />
 -->

<template>
    <!-- layout for selection -->
    <div :style="`max-width: ${maxWidth}`">
        <span
            v-for="option in displayOptions"
            class="badge"
            :class="[
                { 'selection': selection },
                { 'selected': selection && selectedOption.includes(option.interest) }
            ]"
            :style="{ backgroundColor: option.color }"
            @click="() => handleChoice(option.interest)"
        >
            {{ option.interest }}
        </span>
    </div>
</template>

<script>
import interests from '../../assets/config.json';

export default {
    props: [
        'selectedOption',
        'selection',
        'maxWidth'
    ],
    data() {
        return {
            options: interests.interestColors.map(item => item.interest)
            // options:[
            //     'Music',
            //     'Games',
            //     'Technology',
            //     'Sports',
            //     'Dancing',
            //     'Instruments',
            //     'Goth',
            //     'Lifestyle'
            // ]
        }
    },
    emits: [
        'interest-selected'
    ],
    methods: {
        // handle when user selects the interest
        handleChoice(option){
            if (this.selection) {
                this.$emit('interest-selected', option);
            }
        }
    },
    computed: {
        // get correct list to display interests
        displayOptions() {
            // if (this.selection) {
            //     return this.options;
            // }
            // else {
            //     return this.selectedOption;
            // }
            if (this.selection) {
                return interests.interestColors;
            } else {
                return interests.interestColors.filter(item => this.selectedOption.includes(item.interest));
            }
        }
    }
}
</script>

<style scoped>
div {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    overflow-x: auto;
}
/* Track */
::-webkit-scrollbar-track {
background: #ffffff; 
border-radius: 15px;
}

/* Handle */
::-webkit-scrollbar-thumb {
background: #c9c9c9c4;
border-radius: 15px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
background: #c9c9c98d;
}
.badge {
    padding: 10px;
    color: black;
    user-select: none;
    display: flex;
    align-items: center;
}

.badge.selection {
    border-radius: 20px;
    cursor: pointer;
}

/* .badge-music{
    background-color: #1f92e0;
}

.badge-goth {
    background-color: #8f8f8f;
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

.badge-instruments{
    background-color: #FFAB6F;
}

.badge-coding{
    background-color: #6F74FF;
}

.badge-lifestyle{
    background-color: #FC5454;
} */

.selected {
    border: 3px solid black;
}
</style>