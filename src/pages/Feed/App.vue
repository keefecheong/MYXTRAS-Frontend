<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="col-md-12 pink-header-search"> 
                <input class="search-bar" type="text" placeholder="search">
            </div>
            <h1>Following</h1>
            <div class="blog-container">
                <div class="row">
                    <div class="col-6">
                        <span class="row">
                            <div class="col-2">
                                <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                            </div>
                            <div class="col-10">
                                <p>Joshua Tan</p>
                                <p style="margin-top: -20px;">@youdontknowme</p>
                            </div>
                        </span>
                    </div>
                    <div class="col-6">
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