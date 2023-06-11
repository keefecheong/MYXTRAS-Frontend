<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar currentPage="forums"/>
            <br>
            <h1 id="forumHeader">Latest Updates!</h1>
            <div class="row">
                <div class="col-md-3">
                   <SubscribedForums/>
                </div>
            
                <div class="col-md-6">
                    <div class="row">
                        <ForumLayout/>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="card shadow">
                        <div class="card-body card-position">
                            <h5 class="card-title">Popular Threads</h5>
                            <div v-for="thread in popularThreads" class="row align-center">
                                <div class="col-md-12 d-flex popularThreadContainer">
                                    <p class="profilepic">{{ thread.threadTitle }}</p>
                                    <div class="imageContainer">
                                        <img id="popThreadPic" :src="thread.threadPic" :draggable="isDraggable">
                                    </div>
                                </div>
                                <div class="line"></div>
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
@import url('../../styles/sub-navigation.css');
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
}
.card-title {
    font-size: 2rem;
    text-align: center;
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
.line {
    margin: 2em !important;
    border-top: 1px solid black;
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
.forum-name {
    margin-top: 1.5em;
}
.imageContainer {
    width: 100%;
}
.imageContainer img {
    max-height: 100%;
    max-width: 100%;
}

</style>
<script>
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';
import ForumLayout from '../../components/ForumLayout.vue';
import SubscribedForums from '../../components/SubscribedForums.vue';
export default {
    components: {
        NavSidebar,
        SearchBar,
        ForumLayout,
        SubscribedForums
    },
    data() {
        return {
            // to delete
            isDraggable: false,
           
            followedGroupthreads: [
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://previews.123rf.com/images/parinyabinsuk/parinyabinsuk1407/parinyabinsuk140700176/30136368-young-asian-boy-being-scolded-by-parents.jpg" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "nerdfest", creatorName: "Pompourous", threadTitle: "How do I make my parents proud?", threadPic:"https://www.icegif.com/wp-content/uploads/icegif-2013.gif" ,threadDesc: "My parents are constantly disappointed in me. I get consistent C grades for all my modules which is impressive already. What are...", numOfComments: 10},
                {groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", groupName: "sleeping-ing", creatorName: "notaslacker", threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://media.tenor.com/JVKQ8mJoi7gAAAAC/bocchi-the-rock-hitori-gotou.gif", threadDesc: "I recommend sleeping 10 hours a day to keep your battery full! Message me at +65 12345678 if you want to learn more!", numOfComments: 10}
            ],
            popularThreads: [
                {threadTitle: "How do I make my parents proud?", threadPic:"https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png" },
                {threadTitle: "Here is a pic of me sleeping, what do y’all think? What are some comfortable sleeping positions?", threadPic:"https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png"}
            ]
        }
    },
    methods: {
        retrieveSubscribedGroups(){
            fetch("http://127.0.0.1:5173/")
        }
    },
    
    
}
</script>