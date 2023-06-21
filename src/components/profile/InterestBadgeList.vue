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
                getBadgeClass(option),
                { 'selection': selection },
                { 'selected': selection && selectedOption.includes(option) }
            ]"
            @click="() => handleChoice(option)"
        >
            {{ option }}
        </span>
    </div>
</template>

<script>
export default {
    props: [
        'selectedOption',
        'selection',
        'maxWidth'
    ],
    data() {
        return {
            options:[
                'Kpop',
                'Games',
                'Technology',
                'Sports',
                'Dancing',
                'JPOP',
                'Coding',
                'Lifestyle'
            ]
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
        },
        // Return a class name based on the selected option
        getBadgeClass(option) {
            return `badge-${option.toLowerCase()}`;
        }
    },
    computed: {
        // get correct list to display interests
        displayOptions() {
            if (this.selection) {
                return this.options;
            }
            else {
                return this.selectedOption;
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

.badge {
    padding: 10px;
    color: black;
    user-select: none;
}

.badge.selection {
    border-radius: 20px;
    cursor: pointer;
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
    border: 3px solid black;
}
</style>