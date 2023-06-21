<template>
    <div id="overlay">
        <BlogFormLayout 
            @close-image-form="closeEditBlog" 
            :editMode="true"
        />
    </div>
</template>

<script>
import { useBlogStore } from '../../stores/BlogStore.js';
import BlogFormLayout from './BlogFormLayout.vue';

export default {
    data() {
        return {
            store: useBlogStore()
        }
    },
    components: {
        BlogFormLayout
    },
    emits: [
        'close-edit-blog'
    ],
    methods: {
        // to clear blog store
        clearBlogStore() {
            this.store.blogToEdit = {};
        },
        // to close edit blog 
        closeEditBlog() {
            this.$emit('close-edit-blog');
        }
    },
    async created() {
        // check if store is empty
        // go back to feed if store is empty
        if (JSON.stringify(this.store.blogToEdit) == JSON.stringify({})) {
            location.href = this.location;
        }

        // set event listener to clear blog store when the page is closed
        window.addEventListener('beforeunload', this.clearBlogStore);
    },
    unmounted() {
        // clear blog store
        this.clearBlogStore();
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
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>