<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="row pink-header-search">
                <div class="col-md-3"></div>
                <div class="col-md-6 "> 
                    <input class="search-bar" type="text" placeholder="search">
                </div>
                <div class="col-md-3 d-flex justify-content-end">
                    <!-- check for identity after authentication -->
                    <p class="username">Are you a Ngee Ann Polytechnic student? Log In!</p>
                    <p class="school"></p>
                    <img id="headerprofilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                </div>
            </div>
            <br>
            <h1>Following</h1>
            <br>
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

</template>
<style>
@import url('../../styles/main.css');
</style>
<script>
import NavSidebar from '../../components/NavSidebar.vue';

export default {
    components: {
        NavSidebar
    }
}
</script>