<template>
    <div class="main-container">
        <NavSidebar/>
        <div class="main-content">
            <SearchBar currentPage="admin"/>
            <div class="admin-container">
                
            </div>
        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/admin/adminNavSidebar.vue';
import SearchBar from '../../../components/general/SearchBar.vue';

export default {
    components: {
        NavSidebar,
        SearchBar
    }
}
</script>

<style>
@import url('../../../styles/main.css');
/* container styles */
.blog-container {
    border: #133B5B;
    border-style: solid 1rem;
    margin: auto;
    width: 100%;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);
    border-radius: 30px;
    padding: 50px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

/* blog header styles */
.blog-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 10px;
}

.blog-header>div {
    display: flex;
    flex-direction: row;
    width: 100%;
    column-gap: 15px;
    align-items: center;
}

.blog-profile-pic, .blog-username {
    cursor: pointer;
}

.blog-profile-pic {
    border-radius: 100%;
    object-fit: cover;
    height: 50px;
    width: 50px;
}

.blog-username {
    flex: 1 0 auto;
}

.blog-profile-pic:hover~.blog-username, .blog-username:hover {
    color: var(--primary);
}

.blog-modified-label {
    font-style: italic;
}

.blog-tags-and-location.location-only {
    justify-content: end;
}

.blog-tags-and-location.tag-only {
    justify-content: start;
}

.blog-tags-and-location.tag-and-location {
    justify-content: space-between;
}

.blog-location {
    max-width: 60%;
}

.blog-caption {
    border-bottom: 1px solid lightgray;
    font-style: italic;
}

/* blog content styles */
.blog-image-container {
    position: relative;
}

.blog-item {
    display: none;
}

.blog-item.active {
    display: inherit;
}

.blog-image {
    width: 100%;
}

/* Next & previous buttons */
.blog-prev,
.blog-next {
    cursor: pointer;
    position: absolute;
    top: 50%;
    padding: 16px;
    margin-top: -22px;
    color: white;
    font-weight: bold;
    transition: 0.6s ease;
    border-radius: 0 10px 10px 0 !important;
    user-select: none;
    text-decoration: none;
    background-color: #f1f1f1;
    color: black;
    opacity: 50%;
}

/* Position the "next button" to the right */
.blog-next {
    right: calc(var(--bs-gutter-x) * 0.5);
    border-radius: 10px 0 0 10px !important;
}

/* On hover, add a black background color with a little bit see-through */
.blog-prev:hover,
.blog-next:hover {
    background-color: #f1f1f1;
    color: black;
    opacity: 100%;
}

/* blog indicator styles */
.blog-indicator-container {
    text-align: center;
}

.blog-indicator {
    cursor: pointer;
    height: 15px;
    width: 15px;
    margin: 0 2px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    transition: background-color 0.6s ease;
}

.blog-indicator.active,
.blog-indicator:hover {
    background-color: #717171;
}

/* blog action styles */
.blog-actions {
    position: relative;
}

.blog-actions .row {
    width: fit-content;
    align-items: center;
}
</style>