<template>
    <div class="row">
        <div id="gallery-interest-selection">
            <span>Filter by:</span>

            <InterestBadgeList
                :selectedOption="selectedOption"
                :selection="true"
                @interest-selected="handleInterestSelected"
            />
        </div>
        <div id="no-filtered-blogs" v-if="!(contentLoaded && filteredThreads.length > 0)">
            <p>No threads found.</p>
            <p>Select another filter?</p>
        </div>
    </div>
    <div class="row">
        <div class="col-md-9" >
            <div v-if="contentLoaded && filteredThreads.length > 0">
                <ThreadLayout :threads="filteredThreads"/>
            </div>
        </div>
        <div class="col-md-3 ">
            <div class="sticky-div">
                <div class="popular-community">
                <h1 class="pop-header">Popular Communities</h1>
                <div class="interestCommunity">
                    <h4 class="cat" @click="openForum(1)">Interest 1<div class="triangle-down" id="1"></div></h4>
                    <div class="dropdown-content" id="dc1">
                        <a href="#" class="forum1-1"><img class="forum-pic" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg">Link 1</a>
                        <a href="#" class="forum1-2">Link 2</a>
                        <a href="#" class="forum1-3">Link 3</a>
                        <a href="#" class="forum1-4">Link 4</a>
                        <a href="#" class="forum1-5">Link 5</a>
                    </div>
                </div>
                <div class="interestCommunity">
                    <h4 class="cat" @click="openForum(2)">Interest 2<div class="triangle-down" id="2"></div></h4>
                    <div class="dropdown-content" id="dc2">
                        <a href="#" class="forum2-1">Link 1</a>
                        <a href="#" class="forum2-2">Link 2</a>
                        <a href="#" class="forum2-3">Link 3</a>
                        <a href="#" class="forum2-4">Link 4</a>
                        <a href="#" class="forum2-5">Link 5</a>
                    </div>
                </div>
                <div class="interestCommunity">
                    <h4 class="cat" @click="openForum(3)">Interest 3<div class="triangle-down" id="3"></div></h4>
                    <div class="dropdown-content" id="dc3">
                        <a href="#" class="forum3-1">Link 1</a>
                        <a href="#" class="forum3-2">Link 2</a>
                        <a href="#" class="forum3-3">Link 3</a>
                        <a href="#" class="forum3-4">Link 4</a>
                        <a href="#" class="forum3-5">Link 5</a>
                    </div>
                </div>
                <div class="interestCommunity">
                    <h4 class="cat" @click="openForum(4)">Interest 4<div class="triangle-down" id="4"></div></h4>
                    <div class="dropdown-content" id="dc4">
                        <a href="#" class="forum4-1">Link 1</a>
                        <a href="#" class="forum4-2">Link 2</a>
                        <a href="#" class="forum4-3">Link 3</a>
                        <a href="#" class="forum4-4">Link 4</a>
                        <a href="#" class="forum4-5">Link 5</a>
                    </div>
                </div>
                <div class="interestCommunity last">
                    <h4 class="cat" @click="openForum(5)">Interest 5<div class="triangle-down" id="5"></div></h4>
                    <div class="dropdown-content" id="dc5">
                        <a href="#" class="forum5-1">Link 1</a>
                        <a href="#" class="forum5-2">Link 2</a>
                        <a href="#" class="forum5-3">Link 3</a>
                        <a href="#" class="forum5-4">Link 4</a>
                        <a href="#" class="forum5-5">Link 5</a>
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
                contentLoaded: false
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
                    this.contentLoaded = true;
                    console.log(this.threads)

                })
                .catch((error) => {
                    console.log("This page could not be loaded: ", error);
                });
                
            },
            handleInterestSelected(option) {
                handleInterestSelected(option, this.selectedOption);
            },
            retrieveForums() {
                fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-popular-forums`, {
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
                    this.forums = data;
                    console.log(this.forums)
                    this.contentLoaded = true;

                })
                .catch((error) => {
                    console.log("This page could not be loaded: ", error);
                });
                
            },
        },
        computed: {
            // get filtered threads
            filteredThreads() {
                if (this.selectedOption.length <= 0) {
                    return this.threads;
                }
                else {
                    return this.threads.filter(thread => thread.tags && thread.tags.some(tag => this.selectedOption.includes(tag)));
                }
            },
        }
    }
</script>

<style>
    @import url('../../styles/main.css');
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
        top: 15vh;
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