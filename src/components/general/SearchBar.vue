<template>
    <div class="row pink-header-search" >
        <div class="col-md-3">
        </div>
        <div class="col-md-6 centerElements" > 
            <span class="material-symbols-outlined" style="color: black" id="searchIcon" @click="performSearch" title="Click to search">search</span>
            <input v-model='searchTerm' class="search-bar" type="text" placeholder="Search for Xtras like you!" @keyup.enter="performSearch">
            <SearchResults :results="searchResults" :currentPage="currentPage"/>
        </div>
        <div v-if="currentPage === 'forums'" class="col-md-3 d-flex justify-content-end profileContainter centerElements">
            <button v-if="currentPage === 'forums'" id="createForumBtn" class="white-btn" @click="showForumForm">
                Create Forum
            </button>
            
        </div>
        <div v-if="currentPage === 'feed' || currentPage === 'xplore'" class="col-md-3 d-flex justify-content-end profileContainter centerElements">
            <!-- check for identity after authentication -->
            <div v-if="login" class="col-md-4 margin-top">
                <p class="realname hide-overflow-text" :title="realname">{{ realname }}</p>
                <p class="school">{{ school + '/' + course }}</p>
            </div>
            <a v-if="login" href="/profilePage.html"><img class="headerprofilepic" :src="pfplink"></a>
             
            <a v-if="!login" href="/login.html" class="codepen-button"><span>Log in🔒</span></a>
        </div>
        <div v-if="currentPage === 'admin'" class="col-md-2 d-flex justify-content-end adminContainter centerElements">
            <a class="admin">
                <img class="" src="../../assets/shield_person.svg">
                <p class="admin-text">Admin Panel</p>
            </a>
        </div>
    </div>

    <div id="compensate-searchbar-height"></div>
</template>

<style>

.pink-header-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 102%;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: var(--primary);
}
.disable-scroll {
  overflow-y: hidden;
}
#createForumBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em 5em;
    margin-top: 1vh;
    margin-right: 5vw;
    border-radius: 10px;
}
.button:hover .material-symbols-outlined{
    color: white !important;
}
.centerElements {
    display: flex; align-items: center;
}
.profileContainter {
    margin: 0 !important;
    padding: 0 !important;
}
.margin-top {
    margin: 1em 0 0 0!important;
}
.realname {
    display: block;
    color: white;
    margin: 0;
}
.school {
    display: block;
    color: white;
}
#searchIcon {
    transform: translate(6.5vh);
    font-size: 1.5rem;
}
.search-bar {
    display: flex;
    align-items: center;
    margin: auto !important;
    padding: 15px;
    padding-left: 63px;
    border: none;
    border-radius: 30px;
    width: 100%;
    box-shadow: 2px 2px 4px #5e5e5e;
}

.headerprofilepic {
    width: 5rem;
    height: 5rem;
    border: #133B5B 0.3rem solid;
    border-radius: 100%;
    margin-right: 3em;
}

/* Login button CSS */
.codepen-button {
    display: block;
    cursor: pointer;
    color: rgb(0, 0, 0);
    margin: auto;
    margin-right: 4rem;
    position: relative;
    text-decoration: none;
    font-weight: 600;
    border-radius: 10px;
    overflow: hidden;
    padding: 3px;
    isolation: isolate;
}
  
.codepen-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 400%;
    height: 100%;
    background: linear-gradient(115deg, #bf1950, var(--primary), var(--secondary));
    background-size: 25% 100%;
    animation: an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop .75s linear infinite;
    animation-play-state: paused;
    translate: -5% 0%;
    transition: translate 0.25s ease-out;
}
  
.codepen-button:hover::before {
    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
}
  
@keyframes an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop {
    to {
        transform: translateX(-25%);
    }
}
  
.codepen-button span {
    position: relative;
    display: block;
    padding: 0.7rem 1.5rem;
    font-size: 1.1rem;
    background: #ffffff;
    border-radius: 10px;
    height: 100%;
}

.adminContainter {
    margin-left: 4%;
    margin-top: 1% !important;
    margin-bottom: 1% !important;
    cursor: pointer;
}

.admin {
    display: flex;
    align-items: center;
}

.admin-text {
    color: white;
    font-weight: bold;
    margin: 0;
    margin-left: 1em;
}
</style>

<script>
import SearchResults from '../../components/general/SearchResults.vue';

export default {
    components: {
        SearchResults
    },
    props: {
        currentPage: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            login: false,
            realname: '',
            school: '',
            course: '',
            searchResults: [],
            searchTerm: '',
        }
    },
    mounted() {
        this.checkAuth();
        this.compensateSearchBar();
    },
    emits: [
        'show-forum-form'
    ],
    methods: {
        showForumForm() {
            this.$emit('show-forum-form');
        },
        async performSearch() {
            let searchObject;
            if (this.searchTerm.trim() !== '') {
                document.querySelector('.resultsContainer').style.display = 'block';
            }
            else {
                document.querySelector('.resultsContainer').style.display = 'none';
            }
            if (this.currentPage === 'feed') {
                searchObject = 'users'
            }
            else if (this.currentPage === 'forums'){
                searchObject = this.currentPage
            }
            else if (this.currentPage === 'xplore'){
                searchObject = 'users-forums'
            }
            try {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/search/${searchObject}?term=${this.searchTerm.trim()}`, {
                method: 'GET',
                credentials: "include",
                }).then(async response => {
                    await response.json().then(data => {
                        this.searchResults = data.topSixResults;
                    })
                })
            } catch (error) {
                console.error('Error performing search:', error);
            }
        },
        async checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
                method: "GET",
                credentials: "include",
            }).then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        // Checks if user has setup their profile, if not:
                        if (data.is_profile_setup === false){
                            location.href = '/setupProfile.html';
                            return;
                        }
                        else {
                            this.realname = data.real_name;
                            this.school = data.school;
                            this.course = data.course;
                            this.pfplink = data.profile_pic_link;
                            this.login = true;
                        }
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        // to compensate height of searchbar (absolute positioned)
        compensateSearchBar() {
            // set timeout before setting height to wait for browser to finish rendering
            setTimeout(function() {
                const searchbar = document.querySelector('.pink-header-search');
                const searchbarHeight = window.getComputedStyle(searchbar).height;

                document.getElementById('compensate-searchbar-height').style.height = searchbarHeight;
            }, 100);
        }
    }
}
</script>
