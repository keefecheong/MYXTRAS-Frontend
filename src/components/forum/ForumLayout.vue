<template>
    <div class="forum-container" v-if="recentThreads">
        <div class="row">
            <div v-for="thread in recentThreads">
                <div class="card shadow threadContainer">
                    <div class="row">
                        <div class="col-md-2">
                            <span @click="viewForum(thread.parent_id._id)">
                                <img id="threadGroupPic" :src="thread.parent_id.forum_pic_link">
                            </span>
                        </div>

                        <div class="col-10 threadContent">
                            <p id="meta"><a @click="viewForum(thread.parent_id._id)" class="forum-name">{{ "x/" + thread.parent_id.forum_id}}</a>{{ " ~ Posted by: @" + thread.creator_id.username }}</p>  
                            <p id="thread-title">{{ thread.title }}</p>  
                            <p id="thread-description">{{ thread.content }}</p>
                            <div class="imageContainer">
                                <img id="threadPic" :src="thread.content_link" :draggable="isDraggable">
                            </div>
                            <br>
                            <div class="d-flex justify-content-end">
                                <a id="commentsText" @click="viewThread(thread)" >View {{ thread.numOfComments }} comments</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import url('../../styles/main.css');
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    margin: 0 1vh 3vh 1vh;
}
.threadContainer {
    padding: 2em 3em 1em 3em !important;

}
.threadContent {
    padding-right: 2em !important;
}
#forumHeader {
    margin-bottom: 0.5em;
}
#meta {
    font-size: small;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;

}
#threadGroupPic {
    overflow: hidden;
    float:left;
    width: 10vh;
    height: 10vh;
    margin-top: 15px;
    border-radius: 50%;
}
#threadGroupPic:hover{
    cursor: pointer;
}
#thread-title {
    font-weight: bolder;
    font-size: larger;
}
#commentsText {
    margin: 1em 0 0.5em 0;
    text-decoration: none;
    color: gray !important;
}
#commentsText:hover {
    color: var(--primary) !important;
    cursor: pointer;
}
.popularThreadContainer {
    display: flex;
    flex-direction: column;
}
.align-center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2em;
}
.imageContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center; 
}
.imageContainer img {
    margin: auto;
    max-width: 100%;
}

.col-1 {
    margin-right: 30px;
}

.forum-name {
    font-size: 15px;
    margin-top: 1.5em;
    text-decoration: none;
}
.forum-name:hover {
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    color: var(--primary);
}
</style>

<script>

export default {
    data() {
        return {
            recentThreads: [],
            isDraggable: false,
        }
    },
    props: {
        selectedOption: {
            type: Array,
            default: () => [],
        },
        recentThreads: {
            type: Array,
            default: {}
        }
    },
    data(){
        return{
            isDraggable: false,
        }
    },
    methods:{
        
        viewForum(forumID){
            sessionStorage.setItem('forum_id', forumID)
            location.href="/forumGroup.html"
            return this.sortedThreads
        }
    }
}


</script>