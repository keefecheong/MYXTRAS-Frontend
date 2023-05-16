<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="row pink-header-search">
                <div class="col-md-3"></div>
                <SearchBar/>
                <div class="col-md-3 d-flex justify-content-end">
                    <!-- check for identity after authentication -->
                    <p class="username"><br></p>
                    <p class="school"></p>
                    <!-- <img class="headerprofilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png"> -->
                    <button type="button" class="btn btn-light">Log in</button>
                </div>
            </div>
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
                        <img class="blog-image" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                    </div>
                    <div class="row">
                        <p>

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
                            <img class="blog-image" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                        </div>
                        <div class="row">
                            <p>

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
}
.blog-caption {
    text-align: justify;
}
#headerprofilepic{
    max-width: 5vw;
    max-height: 5vw;
    border-radius: 50%;
}
</style>
<script>
import NavSidebar from '../../components/NavSidebar.vue';
import SearchBar from '../../components/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    }
}
</script>