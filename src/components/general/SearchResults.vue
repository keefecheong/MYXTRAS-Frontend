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
  display: flex;
  z-index: 9998;
  background-color: whitesmoke;
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