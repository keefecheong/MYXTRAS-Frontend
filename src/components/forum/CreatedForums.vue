<template>
    <div >
        <div class="card shadow">
            <div class="card-body card-position">
                <h5 class="card-title">Created Forums</h5>
                <div class="row center-align" v-if="createdForums.length === 0">
                    <p>No subscribed forums ☹</p>
                    <p>Head to the <a href="/explore.html">Xplore</a> page!</p>
                </div>
                <div v-for="forum in createdForums" class="row">
                    <div class="col-md-4 d-flex justify-content-end">
                        <img class="groupPic" :src="forum.forum_pic_link[0]" :draggable="isDraggable" @click="viewForum(forum)">
                    </div>
                    <div class="col-md-8">
                        <p class="forum-name" @click="viewForum(forum)">{{ forum.forumName }}</p>  
                    </div>
                </div>
                <h4><i class="bi bi-three-dots three-dots"></i></h4>
            </div>
        </div>
    </div>
</template>

<style>
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
    min-height: 50vh;
    max-height: 100vh;
    overflow: hidden;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;

}
</style>

<script>
export default {
    data() {
        return {
            createdForums: []
        }
    },
    props: ['createdForums'],
    methods: {
       
        async viewForum(forum){
            localStorage.setItem('forumID', forum.forumID);
            location.href = "/forumGroup.html"
        }
    
    }
}
</script>
