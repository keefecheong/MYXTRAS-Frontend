<template>
    <div id="explore-single-blog-container">
        <span class="material-symbols-outlined" id="explore-single-blog-back" title="Go back" @click="hideSingleBlog">arrow_back</span>
        <BlogLayout :blog="blog" />
    </div>
</template>

<script>
import BlogLayout from './BlogLayout.vue';

export default {
    props: [
        'blog'
    ],
    components: {
        BlogLayout
    },
    emits: [
        'hide-single-blog'
    ],
    mounted() {
        window.scrollTo(0, 0);
    },
    methods: {
        // go back to explore page (hide single blog view)
        hideSingleBlog() {
            this.$emit('hide-single-blog');
        }
    }
}
</script>

<style>
#explore-single-blog-container {
    max-width: 80%;
    margin: 0 auto;
    margin-top: 20px;
    position: relative;
}

#explore-single-blog-back {
    color: black;
    position: absolute;
    top: 20px;
    left: -12%;
    font-size: 2em;
}
</style>