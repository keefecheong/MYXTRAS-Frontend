<template>
    <div class="resultsContainer">
        <ul>
            <li v-for="result in results" @click="handleClick(result)">
                {{ displayText(result) }}
            </li>
        </ul>
    </div>
</template>

<style>
.resultsContainer{
    display: none;
    margin-left: auto;
    margin-right: auto;
    top: 77%;
    left: 24px;
    right: 0;
    width: 43%;
    position: absolute;
    z-index: 1;
    overflow: auto;
    background-color: whitesmoke;
    align-items: center;
}

ul {
    margin: 0 !important;
    padding: 0 !important;
}

li {
    list-style-type: none;
    padding: 1em;
    padding-left: 32px;
    border-bottom: 1px black solid;
    cursor: pointer;
}

li:hover {
    background-color: #e6e6e6;
}
</style>

<script>
export default {
    data() {
        return {
            forum: null,
            contentLoaded: false,
            isCreator: false,
            threads: []
        }
    },
    props: ['results', 'currentPage'],
    methods: {
        handleClick(result) {
            if (result.hasOwnProperty('forumID')) {
                this.viewForum(result);
            } else if (result.hasOwnProperty('real_name')) {
                this.viewProfile(result);
            }
        },
        // Taken from ForumGroup.vue
        async viewForum(forum){
            localStorage.setItem('forumID', forum.forumID);
            location.href = "/forumGroup.html"
        },

        async viewProfile(user){
            // TO DO VIEW PROFILE
            location.href = "/ProfilePage.html"
        },
        displayText(result) {

            if (result.hasOwnProperty('forumID')) {
                return `x/${result.forumID} ~ ${result.forumName}`;
            } else if (result.hasOwnProperty('real_name')) {
                return `${result.real_name} ~ ${result.username}`;
            } 
            return '';
        },
    }
};
</script>