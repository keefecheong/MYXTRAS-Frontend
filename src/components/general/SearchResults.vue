<template>
    <div>
      <ul>
        <li v-for="result in results" @click="viewForum(result)">{{ "x/" + result.forumID + " ~ " + result.forumName }}</li>
      </ul>
    </div>
  </template>
  
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
    props: ['results'],
    methods: {
        // Taken from ForumGroup.vue
        async viewForum(forum){
            localStorage.setItem('forumID', forum.forumID);
            location.href = "/forumGroup.html"
        },
    }
  };
  </script>