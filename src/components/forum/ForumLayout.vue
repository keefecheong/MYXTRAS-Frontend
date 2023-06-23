<template>
    <div class="forum-container" v-if="forums">
        <div class="row">
            <div v-for="thread in sortedThreads">
                <div class="card shadow threadContainer">
                    <div class="row">
                        <div class="col-md-2 d-flex justify-content-end">
                            <a @click="viewForum(thread.forumObjID)"><img id="threadGroupPic" :src="thread.forum_pic_link" :draggable="isDraggable"></a>
                        </div>
                        <div class="col-10 threadContent">
                            <p id="meta"><a @click="viewForum(thread.forumObjID)" class="forum-name">{{ "x/" + thread.forumID}}</a>{{ " ~ Posted by: @" + thread.creator_id.username }}</p>  
                            <p id="thread-title">{{ thread.thread_title }}</p>  
                            <p id="thread-description">{{ thread.thread_desc }}</p>
                            <div class="imageContainer">
                                <img id="threadPic" :src="thread.content_links" :draggable="isDraggable">
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
            sortedThreads: [],
            isDraggable: false,
        }
    },
    props: {
        selectedOption: {
            type: Array,
            default: () => [],
        },
        forums: {
            type: Object,
            default: {}
        }
    },
    mounted() {
        this.filterThreads()
    },
    methods:{
        viewForum(forumID){
            localStorage.setItem('forumID', forumID)
            location.href="/forumGroup.html"
        },

        viewThread(thread){
            localStorage.setItem('threadID', thread._id)
            location.href="/threadView.html"
        },
        filterThreads() {
            // Step 1: Retrieve the threads from the filtered forums
            // Store forum details inside the thread array
            console.log('1')
            const createdForumThreads = this.forums.created_forums.reduce((result, forum) => {
                const threadsWithForumDetails = forum.threads.map((thread) => {
                    return {
                        forumID: forum.forumID,
                        forumObjID: forum._id,
                        forumName: forum.forumName,
                        forum_pic_link: forum.forum_pic_link,
                        ...thread,
                    };
                });

                return result.concat(threadsWithForumDetails);
            }, []);

            const subbedForumThreads = this.forums.subscribed_forums.reduce((result, forum) => {
                const threadsWithForumDetails = forum.threads.map((thread) => {
                    return {
                        forumID: forum.forumID,
                        forumObjID: forum._id,
                        forumName: forum.forumName,
                        forum_pic_link: forum.forum_pic_link,
                        ...thread,
                    };
                });

                return result.concat(threadsWithForumDetails);
            }, []);
            
            console.log(this.forums)
            // Step 2: Flatten the threads array
            const mergedThreads = createdForumThreads.concat(...subbedForumThreads);
            // Step 3: Sort the merged threads array in chronological order
            this.sortedThreads = mergedThreads.sort((a, b) => {
                return new Date(b.creation_time) - new Date(a.creation_time);
            });
        },

        viewForum(forumID){
            sessionStorage.setItem('forumID', forumID)
            location.href="/forumGroup.html"
            return this.sortedThreads
        },

        viewThread(thread){
            sessionStorage.setItem('threadID', thread._id)
            location.href="/threadView.html"
        }
    }
}


</script>