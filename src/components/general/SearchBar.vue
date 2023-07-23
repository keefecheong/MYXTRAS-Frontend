<template>
    <div id="searchbar-container" >
        <div id="search-input">
            <span class="material-symbols-outlined" id="search-icon" @click="performSearch" title="Click to search">search</span>
            <input
                id="searchbar-input"
                type="text"
                placeholder="Search"
                v-model='searchTerm'
                @keyup.enter="performSearch" 
                @focus.capture="() => toggleResults(true)" 
                @blur.capture="(e) => toggleResults(false, e)"
                title="Search for a user or forum"
            >

            <SearchResults v-if="showResults && searchResults != null" :results="searchResults" />
        </div>

        <div id="searchbar-right">
            <div v-if="currentPage.startsWith('/forum.html')">
                <button id="create-forum-btn" class="white-btn" @click="showForumForm">
                    Create Forum
                </button>
            </div>
            
            <div v-else-if="login">
                <div>
                    <p class="hide-overflow-text" id="searchbar-realname" :title="realname">{{ realname }}</p>
                    <p class="hide-overflow-text" id="searchbar-school">{{ school + '/' + course }}</p>
                </div>

                <a href="/profilePage.html"><img class="searchbar-profile-pic" :src="pfplink"></a>
            </div>

            <a v-if="!login" href="/login.html" class="codepen-button"><span>Log in🔒</span></a>
        </div>
    </div>

    <!-- <div id="compensate-searchbar-height"></div> -->
</template>

<style scoped>
p { 
    margin-bottom: 0;
}
</style>

<style>
#searchbar-container {
    --searchbar-height: 10dvh;
    --min-profile-pic-height: 50px;
    --max-profile-pic-height: 70px;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    padding: 10px 0;
    background-color: var(--primary);
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    column-gap: 20px;
}

#search-input {
    width: 50%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    background-color: white;
    border-radius: 30px;
    box-shadow: 2px 2px 4px #5e5e5e;
    padding: 15px;
}

#search-icon {
    padding-left: 15px;
    margin: 0;
    font-size: 1.5rem;
    color: black;
}

#searchbar-input {
    border: none;
    outline: none;
    width: 90%;
    background: none;
}

#searchbar-input:focus {
    border-bottom: 1px solid black;
}

#searchbar-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: center;
    padding-right: 2% !important;
}

#create-forum-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em 5em;
    margin-bottom: 0;
    border-radius: 10px;
    box-sizing: border-box;
    white-space: nowrap;
}

#searchbar-right > div {
    max-width: 45%;
    height: var(--searchbar-height);
    position: relative;
    left: 100%;
    transform: translateX(-100%);
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
}

#searchbar-realname, #searchbar-school {
    color: white;
}

.searchbar-profile-pic {
    width: clamp(var(--min-profile-pic-height), var(--searchbar-height), var(--max-profile-pic-height));
    height: clamp(var(--min-profile-pic-height), var(--searchbar-height), var(--max-profile-pic-height));
    border: #133B5B 4px solid;
    border-radius: 100%;
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
    animation: login-border-animation .75s linear infinite;
    animation-play-state: paused;
    translate: -5% 0%;
    transition: translate 0.25s ease-out;
}
  
.codepen-button:hover::before {
    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
}
  
@keyframes login-border-animation {
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
</style>

<script>
import SearchResults from '../../components/general/SearchResults.vue';

export default {
    components: {
        SearchResults
    },
    data() {
        return {
            login: false,
            realname: '',
            school: '',
            course: '',
            searchResults: null,
            searchTerm: '',
            showResults: false,
            currentPage: location.pathname
        }
    },
    mounted() {
        this.checkAuth();
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
            
            if (this.currentPage.startsWith('/feed.html')) {
                searchObject = 'users';
            }
            else if(this.currentPage.startsWith('/forum.html')) {
                searchObject = 'forums';
            }
            else if (this.currentPage.startsWith('/explore.html')) {
                searchObject = 'users-forums';
            }
            
            try {
                await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/search/${searchObject}?term=${this.searchTerm.trim()}`, {
                method: 'GET',
                credentials: "include",
                }).then(async response => {
                    await response.json().then(data => {
                        this.searchResults = data.topSixResults;

                        this.showResults = true;
                    });
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
        // to show/hide results
        toggleResults(show, e) {
            // dont hide results if the new focused element is the search results container
            const searchResultsContainer = document.querySelector('.resultsContainer');
            
            if (searchResultsContainer && searchResultsContainer == e?.relatedTarget) {
                return;
            }

            this.showResults = show;
        }
    }
}
</script>
