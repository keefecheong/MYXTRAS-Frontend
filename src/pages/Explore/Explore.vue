<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Explore</h1>
            <br>
            <div class="row">
                <div class="col-md-2">
                    <button class="sub-navigation" id="blogs" @click="toggleBlogs()">Blogs</button>
                    <br>
                    <button class="sub-navigation" id="forums" @click="toggleForums()">Threads</button>
                </div>
                <div v-if="blogs" class="col-md-11" style="padding-left: 250px;">
                    <div class="container">
                        <div class="gallery">
                            <figure class="gallery__item gallery__item--1">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 1" class="gallery__img">
                            </figure>
                            <figure class="gallery__item gallery__item--2">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 2" class="gallery__img">
                            </figure>
                            <figure class="gallery__item gallery__item--3">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 3" class="gallery__img">
                            </figure>
                            <figure class="gallery__item gallery__item--4">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 4" class="gallery__img">
                            </figure>
                            <figure class="gallery__item gallery__item--5">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 5" class="gallery__img">
                            </figure>
                            <figure class="gallery__item gallery__item--6">
                                <img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Gallery image 6" class="gallery__img">
                            </figure>
                        </div>
                    </div>
                </div>
                <div v-else class="row">
                    <div class="col-md-9" style="padding-left: 250px;">
                        asdfasf
                    </div>
                    <div class="col-md-3" style="right: 0;">
                        <div class="popular-community">
                            <h1 class="pop-header">Popular Communities</h1>
                            <h4 class="cat" @click="openForum(1)">Interest 1<div class="triangle-down" id="1"></div></h4>
                            <div class="dropdown-content" id="dc1">
                                <a href="#" class="forum1-1"><img class="forumpic" src="https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg">Link 1</a>
                                <a href="#" class="forum1-2">Link 2</a>
                                <a href="#" class="forum1-3">Link 3</a>
                                <a href="#" class="forum1-4">Link 4</a>
                                <a href="#" class="forum1-5">Link 5</a>
                            </div>
                            <h4 class="cat" @click="openForum(2)">Interest 2<div class="triangle-down" id="2"></div></h4>
                            <div class="dropdown-content" id="dc2">
                                <a href="#" class="forum2-1">Link 1</a>
                                <a href="#" class="forum2-2">Link 2</a>
                                <a href="#" class="forum2-3">Link 3</a>
                                <a href="#" class="forum2-4">Link 4</a>
                                <a href="#" class="forum2-5">Link 5</a>
                            </div>
                            <h4 class="cat" @click="openForum(3)">Interest 3<div class="triangle-down" id="3"></div></h4>
                            <div class="dropdown-content" id="dc3">
                                <a href="#" class="forum3-1">Link 1</a>
                                <a href="#" class="forum3-2">Link 2</a>
                                <a href="#" class="forum3-3">Link 3</a>
                                <a href="#" class="forum3-4">Link 4</a>
                                <a href="#" class="forum3-5">Link 5</a>
                            </div>
                            <h4 class="cat" @click="openForum(4)">Interest 4<div class="triangle-down" id="4"></div></h4>
                            <div class="dropdown-content" id="dc4">
                                <a href="#" class="forum4-1">Link 1</a>
                                <a href="#" class="forum4-2">Link 2</a>
                                <a href="#" class="forum4-3">Link 3</a>
                                <a href="#" class="forum4-4">Link 4</a>
                                <a href="#" class="forum4-5">Link 5</a>
                            </div>
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
    </div>

</template>
<style>
@import url('../../styles/main.css');
/*Start of blog css */
.sub-navigation {
    background-color: #ffffff;
    border: #e53a73 solid 3.5px;
    border-radius: 10px;
    color: black;
    height: 4rem;
    width: 8.5rem;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    place-self: center;
    font-size: 1.2rem;
    transition: all 0.3s;
}

.sub-navigation:hover {
    background-color: #e53a73;
    color: white;
    cursor: pointer;
    font-size: 1.4rem;
    font-weight: bold;
}

.col-md-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    position: fixed;
}


.gallery {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 5vw);
    grid-gap: 1rem; 
}

.gallery__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block; 
}

.gallery__item--1 {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
}

.gallery__item--2 {
    grid-column-start: 3;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: 3;
}

.gallery__item--3 {
    grid-column-start: 5;
    grid-column-end: 9;
    grid-row-start: 1;
    grid-row-end: 6;
}

.gallery__item--4 {
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 3;
    grid-row-end: 6;
}

.gallery__item--5 {
    grid-column-start: 1;
    grid-column-end: 5;
    grid-row-start: 6;
    grid-row-end: 9;
}

.gallery__item--6 {
    grid-column-start: 5;
    grid-column-end: 9;
    grid-row-start: 6;
    grid-row-end: 9;
}

/*Start of forum css */
.popular-community {
    border: #e53a73 solid 3.5px;
    border-radius: 13px;
    height: 100%;
    width: 100%;
    padding: 20px 0 40px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    place-self: center;
    transition: all 0.3s;
}

.active {
    background-color: #e53a73;
}

.pop-header {
    font-size: 1.5rem;
    color: #e53a73;
    font-weight: bold;
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
}

a {
    text-decoration: none !important;
    color: black !important;
}

.cat {
    font-size: 1.2rem;
    background-color: #e53a73;
    width: 100%;
    color: #ffffff;
    display: flex;
    align-items: center;
    padding-left: 35% !important;
    padding: 10px;
    border-bottom: 1px solid #443b3b;
    margin: 0;
}

.dropdown-content {
    display: none;
}

.triangle-up {
	width: 0;
	height: 0;
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-bottom: 15px solid #ffffff;
    margin-left: 40px !important;
    cursor: pointer;
}

.triangle-down {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 15px solid #ffffff;
    margin-left: 40px !important;
    cursor: pointer;
}

.active2 {
    display: block;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.forumpic {
    height: 30px;
    width: 30px;
    border-radius: 100%;
    margin-right: 20px; 
}
</style>

<script>
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    },
    data() {
        return {
            blogs: true,
        }
    },
    methods: {
        toggleBlogs() {
            this.blogs = true;
            document.getElementById("blogs").className += " active";
            document.getElementById("forums").className = "sub-navigation";
        },
        toggleForums() {
            this.blogs = false;
            document.getElementById("forums").className += " active";
            document.getElementById("blogs").className = "sub-navigation";
        },
        openForum(no) {
            var x = document.getElementById(no).className;
            if (x == "triangle-down") {
                document.getElementById("dc"+no).className += " active2";
                document.getElementById(no).className = "triangle-up";
            } else {
                document.getElementById("dc"+no).className = "dropdown-content";
                document.getElementById(no).className = "triangle-down";
            }
        }
    }
}
</script>