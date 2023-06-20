<template>
    <div id="overlay" >
        <BlogFormLayout @close-image-form="closeCreateBlog" />
    </div>
</template>

<script>
import BlogFormLayout from './BlogFormLayout.vue';

export default {
    components: {
        BlogFormLayout
    },
    emits: [
        'close-create-blog'
    ],
    methods: {
        // to close create blog view
        closeCreateBlog() {
            this.$emit('close-create-blog');
        }
    }
}
</script>

<style>
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>