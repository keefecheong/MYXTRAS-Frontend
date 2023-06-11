<template>
    <div class="forum-container">
        <div class="row">
            <div v-for="thread in followedGroupthreads">
                <div class="card shadow threadContainer">
                <div class="row">
                    <div class="col-2"></div>
                    <div class="col-10"><span v-for="option in selectedOption" id="interest-badge" :class="[getBadgeClass(option), { 'selected': selectedButton === option }]">{{ option }}</span></div>
                </div>
                <div class="row">
                    <div class="col-md-2 d-flex justify-content-end">
                        <a href='./forumGroup.html'><img id="threadGroupPic" :src="thread.groupPic" :draggable="isDraggable"></a>
                    </div>
                    <div class="col-10 threadContent">
                        <p id="meta"><a href="#" class="forum-name">{{ "x/" + thread.groupName}}</a>{{ " ~ Posted by: @" + thread.creatorName }}</p>  
                        <p id="thread-title">{{ thread.threadTitle }}</p>  
                        <p id="thread-description">{{ thread.threadDesc }}</p>
                        <div class="imageContainer">
                            <img id="threadPic" :src="thread.threadPic" :draggable="isDraggable">
                        </div>
                        <br>
                        <div class="d-flex justify-content-end">
                            <a id="commentsText" href="/threadView.html">View {{ thread.numOfComments }} comments</a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<style>
@import url('../styles/main.css');
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    margin: 0 1vh 3vh 1vh;
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
    color: var(--primary);
    font-weight: bolder;
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
/* 
.forum-caption {
    text-align: justify;
    word-wrap: break-word;
}

.forum-image {
    border-radius: 10px;
    max-width: 100%;
    max-height: 500px;
    display: flex;
    margin: auto;
} */

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
import { Button } from 'bootstrap';
export default{
    props: {
        selectedOption: {
            type: Array,
            default: () => [],
        },
    },

    data(){
        return{
            selectedOption: ['Kpop','Games'],
            isDraggable: false,
            
            followedGroupthreads: [
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://previews.123rf.com/images/parinyabinsuk/parinyabinsuk1407/parinyabinsuk140700176/30136368-young-asian-boy-being-scolded-by-parents.jpg" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://www.icegif.com/wp-content/uploads/icegif-2013.gif" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10}
            ],
            
        }
    },
    methods:{
        
        getBadgeClass(option) {
            if (this.selectedOption.includes(option)) {
                return `badge ${this.getBadgeColor(option)} selected`;
            }
            return `badge ${this.getBadgeColor(option)}`;
        },

        getBadgeColor(option) {
            // Return a class name based on the selected option
            switch (option) {
            case 'Kpop':
                return 'badge badge-kpop';
            case 'Games':
                return 'badge badge-games';
            case 'Technology':
                return 'badge badge-technology';
            case 'Sports':
                return 'badge badge-sports'
            case 'Dancing':
                return 'badge badge-dancing'
            case 'JPOP':
                return 'badge badge-jpop'
            case 'Coding':
                return 'badge badge-coding'
            case 'Lifestyle':
                return 'badge badge-lifestyle'
            }
            return `badge-${bg-info}`;
        },
    }
}


</script>