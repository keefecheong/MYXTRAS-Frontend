<template>
    <div class="forum-container">
        <div class="row">
            <div v-for="thread in this.sortedThreads">
                <div class="card shadow threadContainer">
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-10"><span v-for="option in selectedOption" id="interest-badge" :class="[getBadgeClass(option), { 'selected': selectedButton === option }]">{{ option }}</span></div>
                    </div>
                    <div class="row">
                        <div class="col-md-2 d-flex justify-content-end">
                            <a @click="viewForum(thread.forumID)"><img id="threadGroupPic" :src="thread.forum_pic_link" :draggable="isDraggable"></a>
                        </div>
                        <div class="col-10 threadContent">
                            <p id="meta"><a @click="viewForum(thread.forumID)" class="forum-name">{{ "x/" + thread.forumID}}</a>{{ " ~ Posted by: @" + thread.creator_id.username }}</p>  
                            <p id="thread-title">{{ thread.thread_title }}</p>  
                            <p id="thread-description">{{ thread.thread_desc }}</p>
                            <div class="imageContainer">
                                <img id="threadPic" :src="thread.content_links[0]" :draggable="isDraggable">
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
export default {
    data() {
        return {
            sortedThreads: []
        }
    },
    props: {
        selectedOption: {
            type: Array,
            default: () => [],
        },
        forums: {
            type: Array,
            default: {}
        }
    },
    watch: {
        subbedForums: {
            immediate: false,
            handler(newVal, oldVal) {
                this.filterThreads();
            }
        }
    },
    data(){
        return{
            isDraggable: false,
        }
    },
    methods:{
        filterThreads() {
            // Step 1: Retrieve the threads from the filtered forums
            // Store forum details inside the thread array
            const threads = this.forums.reduce((result, forum) => {
                const threadsWithForumDetails = forum.threads.map((thread) => {
                    return {
                        forumID: forum.forumID,
                        forumName: forum.forumName,
                        forum_pic_link: forum.forum_pic_link,
                        ...thread,
                    };
                });

                return result.concat(threadsWithForumDetails);
            }, []);
            
            // Step 2: Flatten the threads array
            const mergedThreads = [].concat(...threads);
            
            // Step 3: Sort the merged threads array in chronological order
            this.sortedThreads = mergedThreads.sort((a, b) => {
                return new Date(b.creation_time) - new Date(a.creation_time);
            });

            console.log(this.sortedThreads)
        },

        viewForum(forumID){
            localStorage.setItem('forumID', forumID)
            location.href="/forumGroup.html"
        },

        viewThread(thread){
            localStorage.setItem('threadID', thread._id)
            location.href="/threadView.html"
        },
        // getBadgeClass(option) {
        //     if (this.selectedOption.includes(option)) {
        //         return `badge ${this.getBadgeColor(option)} selected`;
        //     }
        //     return `badge ${this.getBadgeColor(option)}`;
        // },

        // getBadgeColor(option) {
        //     // Return a class name based on the selected option
        //     switch (option) {
        //     case 'Kpop':
        //         return 'badge badge-kpop';
        //     case 'Games':
        //         return 'badge badge-games';
        //     case 'Technology':
        //         return 'badge badge-technology';
        //     case 'Sports':
        //         return 'badge badge-sports'
        //     case 'Dancing':
        //         return 'badge badge-dancing'
        //     case 'JPOP':
        //         return 'badge badge-jpop'
        //     case 'Coding':
        //         return 'badge badge-coding'
        //     case 'Lifestyle':
        //         return 'badge badge-lifestyle'
        //     }
        //     return `badge-${bg-info}`;
        // },
    }
}


</script>