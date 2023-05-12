var release = 0;
var fix = 0;

// set scroll listener to make sidebar dynamic
window.onscroll = function(e) {
    this.sidebar = document.getElementById('sidebar-wrapper');
    this.mainContent = document.getElementById('main-content');

    // check if the scroll is upwards or downwards
    if (window.scrollY < this.lastScrollY) {
        scrollUp();
    }
    else {
        scrollDown();
    }

    this.lastScrollY = window.scrollY;
}

// to be called upon scroll up
function scrollUp() {
    // release sidebar when it is fixed to the bottom, set it to position: absolute at its current position so the sidebar scrolls normally
    // set release variable for use when sticking sidebar on the top
    if (this.sidebar.classList.contains('fixToBottom')) {
        this.sidebar.classList.remove('fixToBottom');
        this.sidebar.style.position = 'absolute';
        this.sidebar.style.top = `${Math.abs(this.sidebar.getBoundingClientRect().top) - (this.sidebar.offsetHeight - window.innerHeight)}px`;
        release = this.sidebar.offsetTop;
    }

    // make sidebar stick to the top when the top of the sidebar touches the top of the window
    if (window.scrollY <= release) {
        this.sidebar.style.position = '';
        this.sidebar.style.top = '';
        this.sidebar.classList.add('stickToTop');
        this.mainContent.classList.remove('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
    }

    // remove styles from sidebar when scrolled to the top of the page
    if (window.scrollY == 0) {
        this.sidebar.classList.remove('stickToTop');
    }
}

// to be called upon scroll down
function scrollDown() {
    // release sidebar when it sticks to the top, set it to position: absolute at its current position so the sidebar scrolls normally
    // set fix variable for use when fixing sidebar to the bottom
    if (this.sidebar.classList.contains('stickToTop')) {
        this.sidebar.classList.remove('stickToTop');
        this.sidebar.style.position = 'absolute';
        this.sidebar.style.top = `${Math.abs(this.sidebar.getBoundingClientRect().top)}px`;
        fix = this.sidebar.offsetTop + this.sidebar.offsetHeight;
        return;
    }

    // make sidebar fixed at bottom when the bottom of the sidebar touches the bottom of the window
    if ((window.innerHeight + window.scrollY) >= this.sidebar.offsetHeight) {
        this.sidebar.classList.remove('stickToTop');
        this.sidebar.classList.add('fixToBottom');
        this.mainContent.classList.add('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
    }

    // make sidebar fixed at bottom when the sidebar has position: absolute, based on whether it is released from sticky or fixed mode
    if (this.sidebar.style.position == 'absolute') {
        if (fix == 0) {
            if ((window.scrollY + window.innerHeight) >= (release + this.sidebar.offsetHeight)) {
                this.sidebar.style.position = '';
                this.sidebar.style.top = '';
                this.sidebar.classList.add('fixToBottom');
                this.mainContent.classList.add('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
            }
        }
        else {
            if ((window.scrollY + window.innerHeight) >= fix) {
                this.sidebar.style.position = '';
                this.sidebar.style.top = '';
                this.sidebar.classList.add('fixToBottom');
                this.mainContent.classList.add('compensateMaximizedSidebar', 'compensateMinimizedSidebar');
                fix = 0;
            }
        }
    }
}