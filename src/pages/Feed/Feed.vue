<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Following</h1>
            <br>
            <div class="container">
                <div class="row">
                    <div class="blog-container">
                        <div class="row">
                            <div class="col-md-6">
                                <span class="row">
                                    <div class="col-md-2">
                                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                                    </div>
                                    <div class="col-md-10">
                                        <p>Joshua Tan</p>
                                        <p style="margin-top: -20px;">@youdontknowme</p>
                                    </div>
                                </span>
                            </div>
                            <div class="col-md-6 d-flex justify-content-end">
                                <span>
                                    <p>
                                        Posted 6 days ago
                                    </p>
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="slideshow-container">
                                <div class="mySlides1">
                                    <img class="blog-image" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                                </div>
                                <div class="mySlides1">
                                    <img class="blog-image" src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1">
                                </div>
                                <div class="mySlides1">
                                    <img class="blog-image" src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg">
                                </div>
                                <a class="prev" @click="plusSlides(-1, 0)">&#10094;</a>
                                <a class="next" @click="plusSlides(1, 0)">&#10095;</a>
                            </div>
                        </div>
                        <div class="row">
                            <p>
                                <p></p>
                                <div style="text-align:center">
                                    <span class="dot1" @click="currentSlide(1, 0)"></span>
                                    <span class="dot1" @click="currentSlide(2, 0)"></span>
                                    <span class="dot1" @click="currentSlide(3, 0)"></span>
                                </div>
                            </p>
                        </div>
                        <div class="row">
                            <p class="blog-caption">
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                            </p>
                        </div>
                        <div class="d-flex justify-content-end">
                            <!-- Retrieve number of comments -->
                            <div class="p-2">
                                <button>View 13 comments</button>
                            </div>
                        </div>
                    </div>

                    <div class="blog-container">
                        <div class="row">
                            <div class="col-md-6">
                                <span class="row">
                                    <div class="col-md-2">
                                        <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                                    </div>
                                    <div class="col-md-10">
                                        <p>Joshua Tan</p>
                                        <p style="margin-top: -20px;">@youdontknowme</p>
                                    </div>
                                </span>
                            </div>
                            <div class="col-md-6 d-flex justify-content-end">
                                <span>
                                    <p>
                                        Posted 6 days ago
                                    </p>
                                </span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="slideshow-container">
                                <div class="mySlides2">
                                    <img class="blog-image" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                                </div>
                                <div class="mySlides2">
                                    <img class="blog-image" src="https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1">
                                </div>
                                <div class="mySlides2">
                                    <img class="blog-image" src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg">
                                </div>
                                <a class="prev" @click="plusSlides(-1, 1)">&#10094;</a>
                                <a class="next" @click="plusSlides(1, 1)">&#10095;</a>
                            </div>
                        </div>
                        <div class="row">
                            <p>
                                <p></p>
                                <div style="text-align:center">
                                    <span class="dot2" @click="currentSlide(1, 1)"></span>
                                    <span class="dot2" @click="currentSlide(2, 1)"></span>
                                    <span class="dot2" @click="currentSlide(3, 1)"></span>
                                </div>
                            </p>
                        </div>
                        <div class="row">
                            <p class="blog-caption">
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol                         Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 
                                Went to the playground with my baby cousn today!! Here are some photos of him. #lol 

                            </p>
                        </div>
                        <div class="d-flex justify-content-end">
                            <!-- Retrieve number of comments -->
                            <div class="p-2">
                                <button>View 13 comments</button>
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

.blog-container {
    border: #133B5B;
    border-style: solid 1rem;
    margin: auto;
    width: 45% !important;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);;
    border-radius: 30px;
    padding: 50px;
    margin-bottom: 100px;
}

.profilepic {
    overflow: hidden;
    float: left;
    width: 48px;
    height: 48px;
    margin-right: 20px;
    border-radius: 50%;

}
.blog-image {
    border-radius: 3%;
    height: 35vw;
    width: 100%;
}
.blog-caption {
    text-align: justify;
}

/* Slideshow container */
.slideshow-container {
    max-width: 1000px;
    position: relative;
    margin: auto;
}

.mySlides1, .mySlides2{
    display: none;
}

/* Next & previous buttons */
.prev, .next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    width: auto;
    padding: 16px;
    margin-top: -22px;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    border-radius: 0 10px 10px 0 !important;
    user-select: none;
    text-decoration:none;
}

/* Position the "next button" to the right */
.next {
    right: 0.75rem;
    border-radius: 10px 0 0 10px !important;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover, .next:hover {
    background-color: #f1f1f1;
    color: black;
}

/* The dots/bullets/indicators */
.dot1, .dot2 {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
}
  
.active, .dot1:hover, .dot2:hover {
    background-color: #717171;
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
            slideIndex: [1,1],
            slideId: ["mySlides1", "mySlides2"],
            dotId: ["dot1", "dot2"]
        }; 
    },
    mounted() {
        this.showSlides(1, 0);
        this.showSlides(1, 1);
    },
    methods: {
        plusSlides(n, no) {
            this.showSlides(this.slideIndex[no] += n, no);
        },
        currentSlide(n, no) {
            this.showSlides(this.slideIndex[no] = n, no);
        },
        showSlides(n, no) {
            let i;
            let slides = this.$el.getElementsByClassName(this.slideId[no]);
            let dots = this.$el.getElementsByClassName(this.dotId[no]);
            if (n > slides.length) { this.slideIndex[no] = 1; }    
            if (n < 1) { this.slideIndex[no] = slides.length; }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[this.slideIndex[no] - 1].style.display = "block";  
            dots[this.slideIndex[no] - 1].className += " active";
        }
  }
}
</script>