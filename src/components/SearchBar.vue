<template>
    <div class="row pink-header-search">
        <div class="col-md-3"></div>
        <div class="col-md-6 " style="display: flex; align-items: center;"> 
            <input class="search-bar" type="text" placeholder="Search">
        </div>
        <div class="col-md-3 d-flex justify-content-end">
            <!-- check for identity after authentication -->
            <p class="username"><br></p>
            <p class="school"></p>
            <img v-if="false" class="headerprofilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
            <a v-else href="/login.html" class="codepen-button"><span>Log in🔒</span></a>
        </div>
    </div>
</template>

<style>
.search-bar {
    display: flex;
    align-items: center;
    margin: auto !important;
    padding: 15px;
    padding-left: 30px;
    border: none;
    border-radius: 30px;
    width: 100%;
}
.pink-header-search {
    display: flex;
    flex-wrap: wrap;
    padding-top: 5vh;
    padding-bottom: 5vh;
    background-color: var(--primary);
}

.headerprofilepic {
    width: 7rem;
    height: 6rem;
    border: #133B5B 0.5rem solid;
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
    background: linear-gradient(115deg,#4fcf70,#fad648,#a767e5,#12bcfe,#44ce7b);
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