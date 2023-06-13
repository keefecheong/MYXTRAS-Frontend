<template>
    <div class="row pink-header-search" >
        <div class="col-md-3">
        </div>
        <div class="col-md-6 centerElements" > 
            <span class="material-symbols-outlined" style="color: black" id="searchIcon">search</span>
            <input class="search-bar" type="text" placeholder="Search for Xtras like you!">
        </div>
        <div v-if="currentPage === 'forums'" class="col-md-3 d-flex justify-content-end profileContainter centerElements">
            <btn v-if="currentPage === 'forums'" id="createForumBtn" @click="sendBool">Create Community</btn>
        </div>
        <div v-if="currentPage === 'feed'" class="col-md-3 d-flex justify-content-end profileContainter centerElements">
            <!-- check for identity after authentication -->
            <div v-if="login" class="col-md-4 margin-top">
                <p class="realname">{{ realname }}</p>
                <p class="school">{{ school + '/' + course }}</p>
            </div>
            <a v-if="login" href="/profilePage.html"><img class="headerprofilepic" :src="pfplink"></a>
             
            <a v-if="!login" href="/login.html" class="codepen-button"><span>Log in🔒</span></a>
        </div>
    </div>
</template>

<style>
.disable-scroll {
  overflow-y: hidden;
}
#createForumBtn {
    background-color: transparent;
    padding: 1em;
    margin-right: 8vh;
    color: white;
    border: 4px solid white;
    border-radius: 10px;
}
#createForumBtn:hover {
    border: 4px solid var(--dark);
    color: var(--dark);
    cursor: pointer;
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
}
.pink-header-search {
    display: flex;
    flex-wrap: wrap;
    padding-top: 2vh;
    padding-bottom: 2vh;
    background-color: var(--primary);
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
</style>

<script>
export default {
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
            course: ''
        }
    },
    mounted() {
        this.checkAuth();
    },
    methods: {
        toggleScrolling() {
            // Get the body element
            const body = document.body;
            body.classList.add('disable-scroll');
        },
        // showPopUpWindow() {
        //     console.log('----------------')
        //     console.log(this.showPopUp)
        //     console.log(this.showPopUp)
        //     this.showPopUp = !this.showPopUp
        //     console.log(this.showPopUp)
        //     console.log(this.showPopUp)
        //     console.log('----------------')

        // },
        sendBool() {
            //this.showPopUpWindow()
            this.toggleScrolling()
            this.$emit('show-popup', !this.showPopUp);
        },
        redirectsetup(){
            fetch("http://127.0.0.1:8081/api/users/setupprofile", {
                method: "GET"
            }).then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
        },
        async checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        
                        if (data.is_profile_setup === false){
                            window.location.href = '/feed.html';
                            return;
                        }
                        else {
                            this.realname = data.real_name;
                            this.school = data.school;
                            this.course = data.course;
                            this.pfplink = data.profile_pic_link;
                            this.login = true;
                            console.log(data.is_profile_setup)
                        }
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .then(data => {
                    console.log('Success:', data);
                    })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
}
</script>
