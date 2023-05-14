<!--
    usage:

    import in .html file:
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    <script src="/src/utils/sticky-sidebar.js" defer></script>

    in App.vue:
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            content
        </div>
    </div>
-->

<template>

    <nav id="sidebar-wrapper">
        <!-- maximized sidebar implementation -->
        <div id="maximized" v-if="maximized">  <!-- maximized sidebar shown when "maximized" is true -->
            <div id="maximized-header-wrapper">
                <h1 id="maximized-header">MyXtras</h1>
                <button class="material-symbols-outlined" id="close-sidebar" @click="toggleSidebar()">keyboard_double_arrow_left</button>
            </div>
            
            <img src="../assets/NgeeAnnLogo.png" alt="Ngee Ann Polytechnic Logo" id="ngee-ann-logo"/>
        
            <a href="/feed.html" :class="{current: checkCurrent('/feed.html')}">
                <span class="material-symbols-outlined">group</span>
                <p class="menu-text">Feed</p>
            </a>
            <a href="/forum.html" :class="{current: checkCurrent('/forum.html')}">
                <span class="material-symbols-outlined">forum</span>
                <p class="menu-text">Forum</p>
            </a>
            <a href="/chat.html" :class="{current: checkCurrent('/chat.html')}">
                <span class="material-symbols-outlined">chat</span>
                <p class="menu-text">Chat</p>
            </a>
            <a href="/explore.html" :class="{current: checkCurrent('/explore.html')}">
                <span class="material-symbols-outlined">emoji_objects</span>
                <p class="menu-text">Xplore</p>
            </a>
            <a href="/events.html" :class="{current: checkCurrent('/events.html')}">
                <span class="material-symbols-outlined">campaign</span>
                <p class="menu-text">Events</p>
            </a>
            <a href="/checkin.html" :class="{current: checkCurrent('/checkin.html')}">
                <span class="material-symbols-outlined">event_available</span>
                <p class="menu-text">Check in</p>
            </a> 
            <a href="/about.html" :class="{current: checkCurrent('/about.html')}">
                <span class="material-symbols-outlined">question_mark</span>
                <p class="menu-text">About us</p>
            </a>
        
        </div>

        <!-- minimized sidebar implementation -->
        <div id="minimized" v-if="!maximized">  <!-- minimized sidebar shown when "maximized" is false -->
            <button class="material-symbols-outlined" @click="toggleSidebar()">keyboard_double_arrow_right</button>
            
            <a href="/feed.html" :class="{current: checkCurrent('/feed.html')}">
                <span class="material-symbols-outlined">group</span>
            </a>
            <a href="/forum.html" :class="{current: checkCurrent('/forum.html')}">
                <span class="material-symbols-outlined">forum</span>
            </a>
            <a href="/chat.html" :class="{current: checkCurrent('/chat.html')}">
                <span class="material-symbols-outlined">chat</span>
            </a>
            <a href="/explore.html" :class="{current: checkCurrent('/explore.html')}">
                <span class="material-symbols-outlined">emoji_objects</span>
            </a>
            <a href="/events.html" :class="{current: checkCurrent('/events.html')}">
                <span class="material-symbols-outlined">campaign</span>
            </a>
            <a href="/checkin.html" :class="{current: checkCurrent('/checkin.html')}">
                <span class="material-symbols-outlined">event_available</span>
            </a> 
            <a href="/about.html" :class="{current: checkCurrent('/about.html')}">
                <span class="material-symbols-outlined">question_mark</span>
            </a>
        </div>
    </nav>

</template>

<script>
    export default {
        data() {
            return {
                maximized: false
            }
        },
        methods: {
            // function to toggle value of "maximized"
            toggleSidebar() {
                this.maximized = !this.maximized;
            },
            checkCurrent(path) {
                return window.location.pathname === path;
            }
        }
    }
</script>

<style>
    /* container styles */
    #sidebar-wrapper {
        width: min-content;
        height: fit-content;
        min-height: 100vh;
        background-color: #133B5B;
    }

    #sidebar-wrapper > div {
        display: inline-block;
        margin: 15px;
    }

    #minimized {
        width: 40px;
    }

    #maximized {
        width: 15vw;
    }

    /* styles to be inherited by pages that use NavSidebar */
    body {
        margin: 0;
    }

    .menu-text {
        padding-bottom: 50px;
    }
    #main-container {
        position: relative;
        display: flex;
        flex-direction: row;
        column-gap: 12px;
    }

    #main-content {
        flex-grow: 1;
    }

    .fixToBottom {
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .stickToTop {
        position: sticky;
        top: 0;
        left: 0;
    }

    .compensateMaximizedSidebar {
        margin-left: 100px
    }

    .compensateMinimizedSidebar {
        margin-left: 80px;
    }

    /* material symbol styles */
    .material-symbols-outlined {
        color: white;
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0 auto;
        display: block;
        cursor: pointer;
        text-align: center;
    }

    /* header style*/
    #maximized-header-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }

    #close-sidebar {
        margin: 0;
        height: 1em;
    }

    #maximized-header {
        color: white;
        margin: 0;
    }

    /* logo style */
    #ngee-ann-logo {
        margin: 30px auto;
        text-align: center;
        display: block;
        margin-top: 30px;
        border-radius: 50%;
    }

    /* sidebar link styles */
    a {
        text-decoration: none !important;
        height: fit-content;
        width: match-parent;
        text-decoration: none;
        text-align: center;
        display: block;
        padding: 10px;
        margin-top: 10px;
    }

    a > .material-symbols-outlined {
        margin: 0;
    }

    #maximized > a {
        text-align: left;
    }

    #maximized > a > .material-symbols-outlined {
        display: inline;
    }

    #maximized > a > p {
        color: white;
        display: inline;
        margin-left: 20px;
        font-size: 1.25em;
    }

    /* link/symbol effects */ 
    .material-symbols-outlined:hover, a:hover {
        opacity: 0.8;
    }

    .current, a:hover {
        background-image: linear-gradient(to bottom right, white, lightgray);
        background-color: rgba(173, 216, 230, 0.5);
        border-radius: 10px;
    }

    .current > p, .current > .material-symbols-outlined, a:hover > p, a:hover > .material-symbols-outlined {
        color: black !important;
    }
</style>