<template>
    <div id="explore-blog-container">
        <!-- layout for blog pictures -->
        <div v-if="!showSingleBlog" id="gallery-container">
            <div id="gallery-interest-selection" class="sticky-filter">
                <span>Filter by:</span>

                <InterestBadgeList
                    :selectedOption="selectedOption"
                    :selection="true"
                    @interest-selected="handleInterestSelected"
                />
            </div>

            <div id="explore-blog-gallery" v-if="filteredBlogs.length > 0">
                <div id="gallery">
                    <keep-alive>
                        <BlogExploreLayout 
                            v-for="(blog, index) in filteredBlogs"
                            :blogLink="blog.content_links[0]"
                            :blogId="blog._id"
                            :blogIndex="index"
                            :key="index"
                            :id="index"
                            @show-single-blog="handleShowSingleBlog"
                        />
                    </keep-alive>
                </div>

                <div id="no-more-blogs">
                    <p>That's the end. Check again later for more content!</p>
                    <a href="/profilePage.html?create">Create your own?</a>
                </div>
            </div>

            <div v-else id="no-filtered-blogs">
                <p>No posts found.</p>
                <p>Select another filter?</p>
            </div>
        </div>

        <!-- layout for single blog view -->
        <div v-else>
            <ExploreSingleBlogLayout
                :blog="selectedBlog"
                @hide-single-blog="handleHideSingleBlog"
            />
        </div>
    </div>
</template>

<script>
import BlogExploreLayout from '../../components/blog/BlogExploreLayout.vue';
import ExploreSingleBlogLayout from '../../components/blog/ExploreSingleBlogLayout.vue';
import InterestBadgeList from '../../components/general/InterestBadgeList.vue';
import handleInterestSelected from '../../utils/general/defaultInterestSelectedCallback.js';

export default {
    data() {
        return {
            showSingleBlog: false,
            selectedBlogId: '',
            selectedBlogIndex: '',
            selectedOption: []
        }
    },
    props: [
        'blogs'
    ],
    components: {
        BlogExploreLayout,
        ExploreSingleBlogLayout,
        InterestBadgeList
    },
    updated() {
        // scroll to blog if coming back from single blog view
        this.scrollToBlog();
    },
    methods: {
        // toggle single blog view
        toggleSingleBlog(show) {
            this.showSingleBlog = show;
        },
        // handle show-single-blog event to show single blog view
        handleShowSingleBlog(blogId, blogIndex) {
            this.selectedBlogId = blogId;
            this.selectedBlogIndex = blogIndex;
            this.toggleSingleBlog(true);
        },
        // handle hide-single-blog event to hide single blog view
        handleHideSingleBlog() {
            this.selectedBlogId = '';
            this.toggleSingleBlog(false);
        },
        // scroll to the position of the clicked blog when returned to main explore page from single blog view
        scrollToBlog() {
            if (this.selectedBlogIndex != '' && this.selectedBlogId == '') {
                document.getElementById(this.selectedBlogIndex).scrollIntoView({
                    block: 'center'
                });

                // reset index back to default
                this.selectedBlogIndex = '';
            }
        },
        // handle interest-selected event to update filtered blogs
        handleInterestSelected(option) {
            handleInterestSelected(option, this.selectedOption);
        }
    },
    computed: {
        // get filtered blogs
        filteredBlogs() {
            if (this.selectedOption.length <= 0) {
                return this.blogs;
            }
            else {
                return this.blogs.filter(blog => blog.tags && blog.tags.some(tag => this.selectedOption.includes(tag)));
            }
        },
        // get blog to display in single blog view
        selectedBlog() {
            return this.blogs.find(blog => blog._id == this.selectedBlogId);
        }
    }
}
</script>

<style>
.sticky-filter {
    position: sticky;
    top: 15vh;
    right: 5vw;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
}

figure {
    margin: 0;
}

#explore-blog-container {
    max-width: 90%;
    margin: 0 auto;
    margin-bottom: 40px;
    position: relative;
}

#gallery-container {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    align-items: center;
}

#gallery-interest-selection {
    display: flex;
    flex-direction: row;
    column-gap: 15px;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 5px 5px;
    border-radius: 15px;
}

#explore-blog-gallery {
    display: flex;
    flex-direction: column;
    row-gap: 30px;
    align-items: center;
}

#gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 50px;
    padding-bottom: 50px;
    border-bottom: 1px solid lightgray;
}

#no-more-blogs {
    text-align: center;
}

#no-filtered-blogs {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>