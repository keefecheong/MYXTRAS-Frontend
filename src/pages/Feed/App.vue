<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div class="col-md-6 pink-header-search"> 
                <input class="search-bar" type="text" placeholder="search">
            </div>
            <h1>Following</h1>
            <div class="blog-container">
                <div class="blog-content col-md-12">
                    <div class="row">
                        <span>
                            <img class="profilepic" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
                            <p>Joshua Tan
                            </p>
                        </span>
                        <span>
                            <p>
                                Posted 6 days ago
                            </p>
                        </span>
                    </div>
                    <div class="row">
                        <img class="blog-image" src="https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png">
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