<template>
    <img :src="blogLink" class="explore-blog-image" @click="showSingleBlog" title="Click to view" />
</template>

<script>
export default {
    emits: [
        'show-single-blog'
    ],
    props: [
        'blogLink',
        'blogId',
        'blogIndex'
    ],
    methods: {
        // show single blog view
        showSingleBlog() {
            this.$emit('show-single-blog', this.blogId, this.blogIndex);
        }
    }
}
</script>

<style>
.explore-blog-image {
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-out;
    cursor: pointer;
    user-select: none;
}

.explore-blog-image:hover {
    transform: scale(1.1);
}
</style>