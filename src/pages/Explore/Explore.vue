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
                    <button class="sub-navigation" @click="blogs=true">Blogs</button>
                    <br>
                    <button class="sub-navigation" @click="blogs=false">Threads</button>
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
                <div v-else class="col-md-10" style="padding-left: 250px;">
                    asd
                </div>
            </div>
        </div>
    </div>

</template>
<style>
@import url('../../styles/main.css');

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
}
</script>