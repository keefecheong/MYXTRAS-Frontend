<template>
    <div class="resultsContainer" tabindex="0">
        <ul>
            <li
                v-if="results.length > 0"
                v-for="result in results"
                @click="handleClick(result)"
            >
                {{ displayText(result) }}
            </li>
            <li v-else>No results found</li>
        </ul>
    </div>
</template>

<style>
.resultsContainer {
    top: 77%;
    width: 100%;
    position: absolute;
    z-index: 1;
    overflow: auto;
}

ul {
    margin: 0 auto !important;
    padding: 0 !important;
    width: 86%;
    background-color: whitesmoke;
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
import viewForum from "../../utils/general/viewForum.js";
import viewUser from "../../utils/general/viewUser";

export default {
    data() {
        return {
            forum: null,
            contentLoaded: false,
            isCreator: false,
            threads: [],
        };
    },
    props: ["results"],
    methods: {
        handleClick(result) {
            if (result.hasOwnProperty("forum_id")) {
                this.viewForum(result);
            } else if (result.hasOwnProperty("real_name")) {
                this.viewUser(result._id);
            }
        },
        // Taken from ForumGroup.vue
        viewForum(forum) {
            viewForum(forum._id);
        },
        // to view user
        viewUser(userId) {
            viewUser(userId);
        },
        displayText(result) {
            if (result.hasOwnProperty("forum_id")) {
                return `x/${result.forum_id} ~ ${result.forum_name}`;
            } else if (result.hasOwnProperty("real_name")) {
                return `${result.real_name} ~ ${result.username}`;
            }
        },
    },
};
</script>
