<!--
    usage:

    import in .html file:
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

    in App.vue:
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            content
        </div>
    </div>
-->

<template>

    <!-- sidebar wrapper for medium to large screens -->
    <nav id="sidebar-wrapper" v-if="!narrow" class="stickToTop">
        <!-- maximized sidebar implementation -->
        <div id="maximized" v-if="maximized">  <!-- maximized sidebar shown when "maximized" is true -->
            <div id="maximized-header-wrapper">
                <h1 id="maximized-header">MyXtras</h1>
                <!-- <button class="material-symbols-outlined" id="close-sidebar" @click="toggleSidebar()">keyboard_double_arrow_left</button> -->
                <button class="material-symbols-outlined" id="close-sidebar" @click="toggleSidebar()">keyboard_double_arrow_left</button>
            </div>
            
            <img src="../../assets/NgeeAnnLogo.png" alt="Ngee Ann Polytechnic Logo" class="ngee-ann-logo"/>
        
            <a href="/feed.html" class="sidebar-link">
                <span class="material-symbols-outlined">group</span>
                <p>Feed</p>
            </a>
            <a href="/explore.html" class="sidebar-link">
                <span class="material-symbols-outlined">emoji_objects</span>
                <p>Xplore</p>
            </a>
            <a href="/forum.html" class="sidebar-link">
                <span class="material-symbols-outlined">forum</span>
                <p>Forum</p>
            </a>
            <a href="/chat.html" class="sidebar-link">
                <span class="material-symbols-outlined">chat</span>
                <p>Chat</p>
            </a>
            <a href="/events.html" class="sidebar-link">
                <span class="material-symbols-outlined">campaign</span>
                <p>Events</p>
            </a>
            <a href="/checkin.html" class="sidebar-link">
                <span class="material-symbols-outlined">event_available</span>
                <p>Check in</p>
            </a> 
            <a href="/about.html" class="sidebar-link">
                <span class="material-symbols-outlined">question_mark</span>
                <p>About us</p>
            </a>
        
        </div>

        <!-- minimized sidebar implementation -->
        <div id="minimized" v-if="!maximized">  <!-- minimized sidebar shown when "maximized" is false -->
            <!-- <button class="material-symbols-outlined" @click="toggleSidebar()">keyboard_double_arrow_right</button> -->
            <button class="material-symbols-outlined" @click="toggleSidebar()">keyboard_double_arrow_right</button>
            
            <a href="/feed.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Feed">group</span>
            </a>
            <a href="/explore.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Xplore">emoji_objects</span>
            </a>
            <a href="/forum.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Forum">forum</span>
            </a>
            <a href="/chat.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Chat">chat</span>
            </a>
            <a href="/events.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Events">campaign</span>
            </a>
            <a href="/checkin.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="Check In">event_available</span>
            </a> 
            <a href="/about.html" class="sidebar-link">
                <span class="material-symbols-outlined" title="About">question_mark</span>
            </a>
        </div>
    </nav>

    <!-- sidebar (navbar) wrapper for small screens -->
    <nav id="navbar-wrapper" :class="{stickToTop: !expanded}" v-if="narrow">
        <!-- expanded navbar implementation -->
        <div id="expanded" v-if="expanded">  <!-- expand navbar shown when "expanded" is true -->
            <div>
                <h1 id="expanded-header">MyXtras</h1>
                <button class="material-symbols-outlined" id="close-navbar" @click="toggleNavbar()">close</button>
            </div>
            
            <img src="../assets/NgeeAnnLogo.png" alt="Ngee Ann Polytechnic Logo" class="ngee-ann-logo"/>
        
            <a href="/feed.html" class="navbar-link">
                <span class="material-symbols-outlined">group</span>
                <p>Feed</p>
            </a>
            <a href="/explore.html" class="navbar-link">
                <span class="material-symbols-outlined">emoji_objects</span>
                <p>Xplore</p>
            </a>
            <a href="/forum.html" class="navbar-link">
                <span class="material-symbols-outlined">forum</span>
                <p>Forum</p>
            </a>
            <a href="/chat.html" class="navbar-link">
                <span class="material-symbols-outlined">chat</span>
                <p>Chat</p>
            </a>
            <a href="/events.html" class="navbar-link">
                <span class="material-symbols-outlined">campaign</span>
                <p>Events</p>
            </a>
            <a href="/checkin.html" class="navbar-link">
                <span class="material-symbols-outlined">event_available</span>
                <p>Check in</p>
            </a> 
            <a href="/about.html" class="navbar-link">
                <span class="material-symbols-outlined">question_mark</span>
                <p>About us</p>
            </a>
        
        </div>

        <!-- collapsed navbar implementation -->
        <div id="collapsed" v-if="!expanded">  <!-- collapse navbar shown when "expanded" is false -->
            <h1 id="collapsed-header">MyXtras</h1>
            <button class="material-symbols-outlined" id="open-navbar" @click="toggleNavbar()">menu</button>
        </div>
    </nav>

</template>

<script>
    export default {
        mounted() {
            // call handleResize to set up sidebar based on initial window dimensions
            this.handleResize();
            
            // check for the current page to style links
            this.setCurrent();

            // set scroll listener to make sidebar stick dynamically
            window.addEventListener('scroll', this.handleScroll);

            // set resize listener to make sidebar responsive
            window.addEventListener('resize', this.handleResize);
        },
        updated() {
            // check for the current page after sidebar updates to style links
            this.setCurrent();

            // manage expand/collapse navbar
            this.setNavbar();

            // set margin on main content when sidebar is maximized/minimized
            this.setMargin();
        },
        unmounted() {
            // remove event listeners on unmount
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('resize', this.handleResize);
        },
        data() {
            return {
                maximized: false,
                expanded: false,
                narrow: false,
                currentLocation: 0
            }
        },
        methods: {
            // function to toggle value of "maximized" (toggle normal sidebar)
            toggleSidebar() {
                this.maximized = !this.maximized;
            },
            // function to toggle value of "expanded" (toggle narrow sidebar)
            toggleNavbar() {
                // if the navbar is going to be expanded then hide the main content so only the navbar is shown
                // otherwise show the main content again
                // save the user's current scroll location of the page to return the same content later
                if (!this.expanded) {
                    this.currentLocation = window.scrollY;
                    document.getElementById('main-content').classList.add('hidden');
                }
                else {
                    document.getElementById('main-content').classList.remove('hidden');
                }

                this.expanded = !this.expanded;
            },
            // handle scroll logic
            handleScroll() {
                // don't do anything if sidebar is on narrow screens
                if (this.narrow) {
                    return;
                }

                // check if the scroll is upwards or downwards and handle it accordingly
                if (window.scrollY < this.lastScrollY) {
                    this.scrollUp();
                }
                else {
                    this.scrollDown();
                }

                this.lastScrollY = window.scrollY;
            },
            // handle resize logic
            handleResize() {
                // check if window is narrower than 640px (small device screen width) and changes sidebar to top navbar
                if (window.innerWidth <= 640) {
                    this.narrow = true;
                    this.maximized = false;
                    document.getElementById('main-container').classList.add('narrow');
                    document.getElementById('main-content').classList.remove('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
                }
                else {
                    this.narrow = false;
                    this.expanded = false;
                    document.getElementById('main-container').classList.remove('narrow');
                }
            },
            // to be called upon scroll up
            scrollUp() {
                const sidebar = document.getElementById('sidebar-wrapper');
                const mainContent = document.getElementById('main-content');
                
                // if main content is shorter than sidebar then don't do anything
                if (mainContent.offsetHeight <= sidebar.offsetHeight) {
                    return;
                }

                // release sidebar when it is fixed to the bottom, set it to position: absolute at its current position so the sidebar scrolls normally
                if (sidebar.classList.contains('fixToBottom')) {
                    sidebar.classList.remove('fixToBottom');
                    sidebar.style.position = 'absolute';
                    sidebar.style.top = `${Math.abs(sidebar.getBoundingClientRect().top) - (sidebar.offsetHeight - window.innerHeight)}px`;
                    sidebar.style.left = '0';

                    return;
                }
                // stick sidebar to the top if the top of the sidebar touches the top of the window
                else {
                    if (sidebar.getBoundingClientRect().top >= 0) {
                        sidebar.classList.add('stickToTop');
                        sidebar.style.position = '';
                        sidebar.style.top = '';
                        sidebar.style.left = '';
                        mainContent.classList.remove('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
                    }
                }
            },
            // to be called upon scroll down
            scrollDown() {
                const sidebar = document.getElementById('sidebar-wrapper');
                const mainContent = document.getElementById('main-content');
                
                // if main content is shorter than sidebar then don't do anything
                if (mainContent.offsetHeight <= sidebar.offsetHeight) {
                    return;
                }

                // release sidebar when it sticks to the top, set it to position: absolute at its current position so the sidebar scrolls normally
                if (sidebar.classList.contains('stickToTop')) {
                    sidebar.classList.remove('stickToTop');
                    sidebar.style.position = 'absolute';
                    sidebar.style.top = `${Math.abs(sidebar.getBoundingClientRect().top)}px`;
                    sidebar.style.left = '0';

                    if (document.getElementById('minimized')) {
                        mainContent.classList.add('compensateMinimizedSidebar');
                        mainContent.classList.remove('compensateMaximizedSidebar');
                    }
                    else {
                        mainContent.classList.add('compensateMaximizedSidebar');
                        mainContent.classList.remove('compensateMinimizedSidebar');
                    }

                    return;
                }
                // fix sidebar at the bottom if the bottom of the sidebar touches the bottom of the window
                else {
                    if ((Math.abs(sidebar.getBoundingClientRect().top) + window.innerHeight) >= sidebar.offsetHeight) {
                        sidebar.classList.add('fixToBottom');
                        sidebar.style.position = '';
                        sidebar.style.top = '';
                        sidebar.style.left = '';

                        if (document.getElementById('minimized')) {
                            mainContent.classList.add('compensateMinimizedSidebar');
                            mainContent.classList.remove('compensateMaximizedSidebar');
                        }
                        else {
                            mainContent.classList.add('compensateMaximizedSidebar');
                            mainContent.classList.remove('compensateMinimizedSidebar');
                        }
                    }
                }
            },
            // to check for the current page and set the 'current' class for sidebar links corresponding to the current page
            setCurrent() {
                const links = document.querySelectorAll('.sidebar-link, .navbar-link');
                for (var i = 0; i < links.length; i++) {
                    const link = links[i];
                    if (link.getAttribute('href').split('/')[1] == window.location.pathname.split('/')[1]) {
                        link.classList.add('current');
                    }
                    else {
                        link.classList.remove('current');
                    }
                }
            },
            // to handle navbar behaviour on expand/collapse
            setNavbar() {
                if (!this.narrow) {
                    return;
                }

                // if expand, scroll to the top where the expanded navbar is
                // otherwise scroll back to the location where the user was before expanding
                if (this.expanded) {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'instant'
                    });
                }
                else {
                    window.scrollTo({
                        top: this.currentLocation,
                        left: 0,
                        behavior: 'instant'
                    });
                }
            },
            // to set margins when sidebar is toggled to maximize/minimize
            setMargin() {
                if (this.narrow) {
                    return;
                }

                const sidebar = document.getElementById('sidebar-wrapper');

                if (sidebar.style.position != 'absolute' && !sidebar.classList.contains('fixToBottom')) {
                    return;
                }

                const mainContent = document.getElementById('main-content');

                if (this.maximized) {
                    mainContent.classList.remove('compensateMinimizedSidebar');
                    mainContent.classList.add('compensateMaximizedSidebar');
                }
                else {
                    mainContent.classList.remove ('compensateMaximizedSidebar');
                    mainContent.classList.add('compensateMinimizedSidebar');
                }
            }
        }
    }
</script>

<style>
    /* container styles */
    /* normal sidebar */
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
        min-width: 160px;
    }

    /* navbar */
    #navbar-wrapper {
        width: 100vw;
        max-width: 100%;
        height: fit-content;
        background-color: #133B5B;
        color: white;
        padding: 15px;
        box-sizing: border-box;
        z-index: 1000;
    }

    #expanded {
        min-height: 100vh;
    }

    #collapsed {
        padding: 5px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    /* styles to be inherited by pages that use NavSidebar */
    body {
        margin: 0;
    }
    
    #main-container {
        position: relative;
        display: flex;
        flex-direction: row;
        column-gap: 12px;
    }

    .hidden {
        display: none;
    }

    #main-container.narrow {
        display: initial;
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
        margin-left: max(202px, 15vw + 42px) !important;
    }

    .compensateMinimizedSidebar {
        margin-left: 82px !important;
    }

    /* material symbol styles */
    .material-symbols-outlined {
        color: white;
        background-color: transparent;
        border: 0;
        padding: 0;
        margin: 0 auto;
        display: flex;
        cursor: pointer;
        text-align: center;
        vertical-align: middle;
    }

    /* header styles */
    #maximized-header-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }

    #expanded-header {
        text-align: center;
        padding-top: 15px;
    }

    #collapsed-header {
        margin: 0;
    }

    #open-navbar {
        margin: 0;
    }

    #close-sidebar {
        margin: 0;
    }

    #close-navbar {
        position: absolute;
        right: 15px;
        top: 15px;
    }

    #maximized-header {
        color: white;
    }

    /* logo style */
    .ngee-ann-logo {
        margin: 30px auto;
        text-align: center;
        display: block;
        margin-top: 30px;
        border-radius: 50%;
    }

    /* sidebar link styles */
    a.sidebar-link, a.navbar-link {
        text-decoration: none !important;
        height: fit-content;
        width: match-parent;
        text-align: center;
        display: block;
        padding: 10px;
        margin-top: 10px;
        color: white;
    }

    a > .material-symbols-outlined {
        margin: 0;

    }

    a.sidebar-link {
        text-align: left;
    }

    a.sidebar-link > .material-symbols-outlined, a.navbar-link > .material-symbols-outlined {
        display: inline;
        
    }

    a.sidebar-link > p, a.navbar-link > p {
        display: inline;
        margin-left: 20px;
        font-size: 1.25em;
        vertical-align: middle;
    }

    /* link/symbol effects */ 
    .material-symbols-outlined:hover, a.sidebar-link:hover, a.navbar-link:hover, .current {
        opacity: 0.7;
    }

    .current, a.sidebar-link:hover, a.navbar-link:hover {
        background-color: rgba(255, 255, 255);
        border-radius: 10px;
    }

    .current > *, a.sidebar-link:hover > *, a.navbar-link:hover > * {
        color: black !important;
    }
</style>