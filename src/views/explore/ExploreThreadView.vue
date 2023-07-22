<template v-if="tags && threads">
    <div class="row sticky-filter" id="filterRow">
    <div id="gallery-interest-selection" class="">
            <span>Filter by:</span>

            <InterestBadgeList
                :selectedOption="selectedOption"
                :selection="true"
                @interest-selected="handleInterestSelected"
            />

            <button @click="clearSelection()" id="clearAll-btn">Clear All</button>
        </div>
    </div>
    <div class="row" v-if="this.threads">
        <div class="col-md-9" style="position: relative;">
            <div class="card shadow" v-if="filteredThreads.length == 0">
                <div id="no-filtered-threads">
                    <p>No threads found.</p>
                    <p>Select another filter?</p>
                </div>
            </div>
            <div v-if="!showDetailedThread">
                <ThreadMiniLayout
                    v-for="(thread, index) in filteredThreads"
                    :key="index"
                    :thread="thread"
                    :index="index"
                    :showForumDetails="true"
                    @show-detailed-view="() => toggleDetailedThread(true, index)"
                    @deleted-thread="() => handleDeletedThread(index)"
                />
            </div>

            <div v-else>
                <ThreadDetailedLayout
                    :thread="filteredThreads[selectedIndex]"
                    :key="filteredThreads[selectedIndex]._id"
                    :showBackArrow="false"
                    @close-detailed-view="() => toggleDetailedThread(false, selectedIndex)"
                />
            </div>
        </div>
        <div class="col-md-3">
            <div class="sticky-div">
                <div class="popular-community">
                    <h1 class="pop-header" v-if="tagsLoaded">Popular Communities</h1>
                    <div class="interestCommunity" v-for="(tag, index) in tags">
                        <h4 class="cat" @click="openForum(index)">{{ tag._id }}<div class="triangle-down" :id="`triangle-${index}`"></div></h4>
                        <div class="dropdown-content" :id="'dc'+index" >
                            <div v-for="forum in tag.forums" @click="viewForum(forum)" id="forumContainer">
                                <p><img class="forum-pic" :src="forum.forum_pic_link">{{forum.forum_name}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ThreadMiniLayout from '../../components/forum/ThreadMiniLayout.vue';
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import ThreadDetailedLayout from '../../components/forum/ThreadDetailedLayout.vue';
import viewForum from '../../utils/general/viewForum.js';

export default {
    data() {
        return {
            selectedOption: [],
            tags: [],
            threads: [],
            showDetailedThread: false,
            selectedIndex: null,
            scrollBack: false
        }
    },
    components: {
        ThreadMiniLayout,
        InterestBadgeList,
        ThreadDetailedLayout
    },
    mounted() {
        this.retrieveExploreThreads()
        this.retrieveForums()
    },
    updated() {
        // if scrollBack is true then scroll to that thread
        if (this.scrollBack && this.selectedIndex != null) {
            if (!document.getElementById(this.selectedIndex)) {
                return;
            }

            document.getElementById(this.selectedIndex).scrollIntoView({
                block: 'center'
            });

            // set timeout to clear scrollBack
            setTimeout(() => {
                this.scrollBack = false;
            }, 500);
        }
    },
    methods: {
        // show detailed view of popular thread
        toggleDetailedThread(show, index) {
            this.selectedIndex = index;

            if (!show && index != null) {
                this.scrollBack = true;
            }

            this.showDetailedThread = show;
        },
        openForum(id) {
            const status = document.getElementById(`triangle-${id}`).className;
            
            if (status == "triangle-down") {
                document.getElementById("dc"+id).className += " open-forum";
                document.getElementById(`triangle-${id}`).className = "triangle-up";
            } else {
                document.getElementById("dc"+id).className = "dropdown-content";
                document.getElementById(`triangle-${id}`).className = "triangle-down";
            }
        },
        retrieveExploreThreads() {
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/threads/explore`, {
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

            const index = this.selectedOption.indexOf(option)
            if (index !== -1) {
                this.selectedOption.splice(index, 1);
            } else {
                this.selectedOption.push(option);
            }
        },
        retrieveForums() {
            fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/categorized`, {
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
            viewForum(forum._id);
        },
        // to handle thread deletion
        handleDeletedThread(index) {
            this.recentThreads.splice(index, 1);
        },

        clearSelection(){
            this.selectedOption = [];
        }
    },
    computed: {
        // get filtered threads
        filteredThreads() {
            if (this.selectedOption.length <= 0) {
                this.tagsLoaded = true;
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

<style scoped>
h1 {
    font-weight: normal !important;
}
</style>

<style>
#filterRow {
    margin-bottom: 5dvh;
}
#no-filtered-threads {
    text-align: center;
    margin: 5vh;
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
    top: 15vh;
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

#clearAll-btn{
    width: 6em;
    color: white;
    border: none;
    background: linear-gradient(45deg,#FF6363, #E53A73);
    border-radius: 10px;
    padding: 7px 7px;
    margin-right: 5px;
}
</style>