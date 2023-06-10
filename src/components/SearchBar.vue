<template>
    <div class="row pink-header-search">
        <div class="col-md-3"></div>
        <div class="col-md-6" style="display: flex; align-items: center;"> 
            <span class="material-symbols-outlined" style="color: black" id="searchIcon">search</span>
            <input class="search-bar" type="text" placeholder="Search for Xtras like you!">
        </div>
        <div class="col-md-3 d-flex justify-content-end profileContainter">
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
    padding-top: 1vh;
    padding-bottom: 1vh;
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
        redirectsetup(){
            fetch("http://127.0.0.1:8081/api/users/setupprofile", {
                method: "GET"
            }).then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
        },
        checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch("http://127.0.0.1:8081/api/users", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: "include",
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        if (data.profilesetup === false){
                            this.redirectsetup();
                            return;
                        }
                        else {
                            this.realname = data.realname;
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
