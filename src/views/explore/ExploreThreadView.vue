<template v-if="tags && threads">
    <div class="row sticky-filter" id="filterRow">
        <div id="gallery-interest-selection" class="">
            <span>Filter by:</span>

            <InterestBadgeList
                :selectedOption="selectedOption"
                :selection="true"
                @interest-selected="handleInterestSelected"
            />
        </div>
        <div id="no-filtered-threads" v-if="filteredThreads.length == 0">
            <p>No threads found.</p>
            <p>Select another filter?</p>
        </div>
    </div>
    <div class="row" v-if="this.threads">
        <div class="col-md-9">
            <div>
                <ThreadLayout v-for="(thread, index) in filteredThreads" :thread="thread" :key="index" />
            </div>
        </div>
        <div class="col-md-3 ">
            <div class="sticky-div">
                <div class="popular-community">
                    <h1 class="pop-header" v-if="tagsLoaded">Popular Communities</h1>
                    <div class="interestCommunity" v-for="(tag, index) in tags">
                        <h4 class="cat" @click="openForum(index)">{{ tag._id }}<div class="triangle-down" :id="index"></div></h4>
                        <div class="dropdown-content" :id="'dc'+index" >
                            <div v-for="forum in tag.forums" @click="viewForum(forum)" id="forumContainer">
                                <p><img class="forum-pic" :src="forum.forum_pic_link">{{forum.forumName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ThreadLayout from '../../components/forum/ThreadLayout.vue';
    import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
    import handleInterestSelected from '../../utils/general/defaultInterestSelectedCallback.js';

    export default {
        data() {
            return {
                selectedOption: [],
                tags: [],
                threads: [],
            }
        },
        components: {
            ThreadLayout,
            InterestBadgeList
        },
        mounted() {
            this.retrieveAllThreads()
            this.retrieveForums()
        },
        methods: {
            openForum(id) {
                const status = document.getElementById(id).className;
                
                if (status == "triangle-down") {
                    document.getElementById("dc"+id).className += " open-forum";
                    document.getElementById(id).className = "triangle-up";
                } else {
                    document.getElementById("dc"+id).className = "dropdown-content";
                    document.getElementById(id).className = "triangle-down";
                }
            },
            retrieveAllThreads() {
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/thread/get-threads`, {
                    mode: 'cors',
                    method: 'GET',
                    credentials: 'include'
                }).then(res => {
                    if (res.ok) {
                    return res.json();
                    }
                    throw new Error('Response not OK');
                })
                .then(data => {
                    this.threads = data;

                })
                .catch((error) => {
                    console.log("This page could not be loaded: ", error);
                });
                
            },
            handleInterestSelected(option) {
                handleInterestSelected(option, this.selectedOption);
            },
            retrieveForums() {
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-categorized-forums`, {
                    mode: 'cors',
                    method: 'GET',
                    credentials: 'include'
                }).then(res => {
                    if (res.ok) {
                    return res.json();
                    }
                    throw new Error('Response not OK');
                })
                .then(data => {
                    this.tags = data;
                    this.tagsLoaded = true
                })
                .catch((error) => {
                    console.log("This page could not be loaded: ", error);
                });
                
            },
            viewForum(forum) {
                sessionStorage.setItem('forumID', forum._id)
                location.href = '../forumGroup.html'
            }
        },
        computed: {
            // get filtered threads
            filteredThreads() {
                if (this.selectedOption.length <= 0) {
                    this.tagsLoaded = true;
                    console.log(this.threads.length)
                    return this.threads;
                }
                else {
                    this.tagsLoaded = true;
                    return this.threads.filter(thread => thread.tags && thread.tags.some(tag => this.selectedOption.includes(tag)));
                }
            },
        }
    }
</script>

<style>
    @import url('../../styles/main.css');
    #filterRow {
        margin-bottom: 5vh;
    }
    #no-filtered-threads {
        text-align: center;
        margin-top: 5vh;
    }
    #forumContainer {
        padding-top: 10px;
    }
    #forumContainer:hover {
        border: 1px solid var(--primary);
        border-radius: 10px;
        cursor: pointer;
    }
    .interestCommunity{
        font-size: 1.2rem;
        background-color: rgba(255, 150, 183, 0.6);
        width: 100%;
        border-bottom: 1px solid #443b3b;
        margin: 0;
    }
    #gallery-interest-selection {
        display: flex;
        flex-direction: row;
        column-gap: 15px;
        align-items: center;
        justify-content: center;
    }
    .sticky-div {
        position: sticky;
        top: 20vh;
        right: 5vw;
        display: flex;
        justify-content: flex-end;
        z-index: 1;
    }
    .sticky-filter {
        position: sticky;
        top: 12vh;
        right: 5vw;
        display: flex;
        justify-content: flex-end;
        z-index: 1;
    }
    .popular-community {
        border-radius: 13px;
        height: 100%;
        width: 20rem;
        padding-top: 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        transition: all 0.3s;
    }

    .pop-header {
        margin: 0;
        padding: 1em 0;
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;
        width: 100%;
        border: var(--primary) solid 2px;
        font-size: 1.5rem;
        color: var(--primary);
        font-weight: bold;
        border-bottom: solid transparent;
    }

    .dropdown-content a {
        text-decoration: none !important;
        color: black !important;
    }

    .cat {
        font-size: 1.2rem;
        background-color: var(--primary);
        width: 100%;
        color: #ffffff;
        display: flex;
        justify-content: right;
        padding: 10px;
        border-bottom: 1px solid #443b3b;
        margin: 0;
    }

    .dropdown-content {
        display: none;
        border-left: var(--primary) solid 2px;
        border-right: var(--primary) solid 2px;
    }

    .triangle-up {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 15px solid #ffffff;
        margin-left: 30px;
        margin-right: 70px;
        cursor: pointer;
        display: grid;
        place-self: center;
    }

    .triangle-down {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 15px solid #ffffff;
        margin-left: 30px;
        margin-right: 70px;
        cursor: pointer;
        display: grid;
        place-self: center;
    }

    .open-forum {
        display: block;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
    }

    .forum-pic {
        height: 30px;
        width: 30px;
        border-radius: 100%;
        margin-right: 20px; 
    }

    .last, .last.dropdown-content {
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
    }
</style>