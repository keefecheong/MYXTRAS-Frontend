<template>
    <div class="resultsContainer">
        <ul>
            <li v-if="currentPage === 'forums'" v-for="result in results" @click="viewForum(result)">{{ "x/" + result.forumID + " ~ " + result.forumName }}</li>
            <li v-if="currentPage === 'feed'" v-for="result in results" @click="viewProfile(result)">{{ result.real_name + " ~ " + result.username }}</li>
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
        // Taken from ForumGroup.vue
        async viewForum(forum){
            localStorage.setItem('forumID', forum.forumID);
            location.href = "/forumGroup.html"
        },

        async viewProfile(user){
            localStorage.setItem('real_name', user.real_name);
            location.href = "/ProfilePage.html"
        }
    }
};
</script>