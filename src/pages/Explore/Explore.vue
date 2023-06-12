<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <SearchBar/>
            <br>
            <h1>Explore</h1>
            <br>

            <div class="row">
                <div class="col-md-2 sub-navigation-container">
                    <div class="sub-navigation-links">
                        <router-link to="/blogs" class="sub-navigation">
                            <span>Blogs</span>
                        </router-link>
                        <router-link to="/threads" class="sub-navigation">
                            <span>Threads</span>
                        </router-link>
                    </div>                    
                </div>
                <div class="col-md-9">
                    <router-view />
                </div>
            </div>
        </div>
    </div>

</template>

<style>
@import url('../../styles/main.css');
@import url('../../styles/sub-navigation.css');
</style>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';
import SearchBar from '../../components/general/SearchBar.vue';

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