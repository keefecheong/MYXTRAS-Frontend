<template>
    <div v-for="thread in threads">
        <div class="card shadow threadContainer">
            <div class="row">
                <div class="col-md-1 d-flex justify-content-start">
                    <a><img id="threadGroupPic" :src="thread.creator_id.profile_pic_link" :draggable="isDraggable"></a>
                </div>
                <div class="col-11 threadContent">
                    <p id="meta">{{ "Posted by: @" + thread.creator_id.username }}</p>  
                    <p id="thread-title">{{ thread.thread_title }}</p>  
                    <p id="thread-description">{{ thread.thread_desc }}</p>
                    <InterestBadgeList :selectedOption="thread.tags" :selection="false" :maxWidth="'30%'" class="blog-tags" title="Tags" />
                    <br>
                    <div class="imageContainer">
                        <img id="threadPic" :src="thread.content_links[0]" :draggable="isDraggable">
                    </div>
                    <br>
                    <div class="d-flex justify-content-end">
                        <RouterLink to="/thread">
                            <a id="commentsText" @click="viewThread(thread)">View {{ thread.numOfComments }} comments</a>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css'); 
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    margin: 0 1vh 3vh 1vh;
    margin-top: 50px; 
    margin-right: 10px;
}
.col-10, .col-2 {
    padding: 0;
}
.forum-container {
    border: #133B5B;
    border-style: solid 1rem;
    margin: auto;
}

.threadContainer {
    padding: 2em 3em 1em 3em;

}
.threadContent {
    padding-right: 2em !important;
}
#forumHeader {
    margin-bottom: 0.5em;
}
#meta {
    font-size: small;
    margin-top: 13px;
    margin-bottom: 5px;
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
    border: #133B5B solid 1px;
}
#thread-title {
    font-weight: bolder;
    font-size: larger;
    margin-bottom: 5px;
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
.forum-name {
    margin-top: 1.5em;
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
    font-weight: bold;
    color: #133B5B;
    text-decoration: none;
}
.forum-name:hover {
    font-size: 15px;
    font-weight: bold;
    color: var(--primary);
}


</style>

<script>
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';

export default {
    components: {
        InterestBadgeList,
    },
    data() {
        return {
            isDraggable: false,
        }
    },
    props: ['threads'],
    methods: {
        viewThread(thread) {
            localStorage.setItem("threadID", thread._id)
        }, 
    }
}
</script>