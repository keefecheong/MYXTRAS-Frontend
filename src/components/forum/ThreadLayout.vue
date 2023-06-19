<template>
    <div v-for="thread in threads">
        <div class="card shadow threadContainer">
            <div class="row">
                <div class="col-2"></div>
                <div class="col-10"><span v-for="option in selectedOption" id="interest-badge" :class="[getBadgeClass(option), { 'selected': selectedButton === option }]">{{ option }}</span></div>
            </div>
            <div class="row">
                <div class="col-md-2 d-flex justify-content-end">
                    <a><img id="threadGroupPic" :src="thread.creator_id.profile_pic_link" :draggable="isDraggable"></a>
                </div>
                <div class="col-10 threadContent">
                    <p id="meta">{{ "Posted by: @" + thread.creator_id.username }}</p>  
                    <p id="thread-title">{{ thread.thread_title }}</p>  
                    <p id="thread-description">{{ thread.thread_desc }}</p>
                    <div class="imageContainer">
                        <img id="threadPic" :src="thread.content_links[0]" :draggable="isDraggable">
                    </div>
                    <br>
                    <div class="d-flex justify-content-end">
                        <a id="commentsText" @click="viewThread">View {{ thread.numOfComments }} comments</a>
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
.card-title {
    font-size: 2rem;
    text-align: center;
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

#interest-badge{
    margin: 5px;
    padding: 10px;
    width: 5rem;
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
</style>

<script>
export default {
    
    data() {
        return {
            isDraggable: false,
            threadID: null,
        }
    },
    props: ['threads'],
    methods: {
        viewThread(){
            localStorage.setItem("threadID", this.threadID)
            location.href="/threadView.html"
        },
    }
}
</script>