<template>
    <div id="overlay" >
        <div v-if="!initialized">
            <p>Loading...</p>
        </div>

        <!-- form to upload images -->
        <form id="edit-blog-form" @submit.prevent="submitForm" v-if="initialized">
            <button class="close-button" @click="$router.go(-1)">
                <i class="bi bi-x"></i>
            </button>
            <br>
            <h1 class="form-header">Edit Post</h1>
            <div id="upload-image-container" class="container-fluid">
                <div class="row">
                    <!-- input to select images -->
                    <input type="file" id="upload-image" multiple @change="fileChanged" accept=".jpg, .jpeg, .png" />
                    <label for="upload-image" id="upload-image-label">
                        <p>Drag and drop 
                            <br>
                            or
                            <br> 
                            click <u>here</u> to upload.
                        </p>
                    </label>

                    <!-- display errors -->
                    <div id="upload-image-errors" v-if="files.length > 0 && errors.length > 0">
                        <span>Error{{ errors.length > 1 ? 's' : '' }}:</span>
                        <ul>
                            <li v-for="error in errors">{{ error }}</li>
                        </ul>
                    </div>

                    <!-- display selected file names if there are errors -->
                    <div id="selected-image-names" v-if="files.length > 0 && errors.length > 0">
                        <span>Selected ({{ files.length }}):</span>
                        <ul>
                            <li v-for="(file, index) in files" :class="{invalidFile: invalidFiles.includes(index)}">{{ file.name }} - {{ calculateSize(file.size) }}</li>
                        </ul>
                    </div>
                </div>

                <!-- preview images if there are files selected with no errors -->
                <div class="row" v-if="files.length > 0 && errors.length == 0">
                    <span>Selected ({{ files.length }}):</span>
                    <div v-for="(link, index) in selectedLinks" class="preview-image-container">
                        <img :src="link" />
                        <span>{{ files[index].name }} ({{ calculateSize(files[index].size) }})</span>
                    </div>
                </div>
            </div>
            <div id="upload-image-caption" class="container-fluid">
                <div class="row">
                    <label for="image-caption" id="caption-title">Caption:</label>
                    <textarea id="image-caption" name="image-caption" placeholder="Enter caption here..."></textarea>
                </div>
            </div>
            <br>
            <div id="upload-image-location" class="container-fluid">
                <div class="row">
                    <label for="image-tags" id="location-title">Location:</label>
                    <input type="text" id="image-location" name="image-location" placeholder="Optional"/>
                </div>
            </div>
            <br>
            <div id="upload-image-tags" class="container-fluid">
                <div class="mb-3 row">
                    <label for="image-tags" id="tags-title">Tags:</label>
                    <AdditionButton :tags="selectedOption"/>
                </div>
            </div>
            <div id="comments-opton" class="container-fluid">
                <div class="row">
                    <label for="image-comments" id="comments-title">Turn on comments:</label>
                    <div class="container">
                        <input type="checkbox" class="checkbox" id="checkbox" @click="commentsCheck()">
                        <label class="switch" for="checkbox">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            <br>
            <input class="pink-button" type="reset" value="Clear Selection" @click="resetAll" />
            <!-- 
                disable submit button if 
                1. there are no files selected
                2. there are files selected but contains errors
            -->
            <input class="pink-button disabled" type="submit" :value="submitting ? 'Updating...' : 'Update!'" :disabled="files.length == 0 || (files.length > 0 && errors.length > 0) || submitting" />
        </form>
    </div>
</template>

<script>
import { useBlogStore } from '../../stores/BlogStore.js';
import AdditionButton from '../../components/profile/AdditionButton.vue'

export default {
    components: {
        AdditionButton
    },
    data() {
        return {
            blog: {},
            files: [],
            errors: [],
            selectedLinks: [],
            invalidFiles: [],
            caption: "",
            location: "",
            tags: [],
            comments: false,
            initialized: false,
            toInitFiles: true,
            dataTransfer: new DataTransfer(),
            submitting: false,
            fileUpdated: false
        }
    },
    methods: {
        // initialize data
        async initData() {
            // get blog data
            const store = useBlogStore();
            this.blog = store.blogToEdit;

            // set links
            this.selectedLinks = this.blog.content_links;

            await this.downloadExistingImages();

            this.initialized = true;
        },
        // to handle form submission
        async submitForm(e) {
            this.submitting = true;

            // if user did not edit files then do nothing
            if (!this.fileUpdated) {
                this.submitting = false;

                alert('No changes made.');

                return;
            }

            // check if the user has uploaded any files
            if (this.files.length <= 0) {
                this.submitting = false;

                alert('No files selected.');

                return;
            }

            // checks if there are any errors
            if (this.errors.length > 0) {
                this.submitting = false;

                alert('Invalid files selected.');
                
                return;
            }

            var formData = new FormData();

            // add images to formData
            for (let i = 0; i < this.files.length; i++) {
                formData.append('selectedImages', this.files[i]);
            }

            // send request to backend server with data
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts/${this.blog._id}`, {
                mode: 'cors',
                method: 'PATCH',
                body: formData,
                credentials: 'include'
            }).then((res) => {
                this.submitting = false;

                // reset form
                e.target.reset();
                this.resetAll();

                res.json().then((data) => {
                    alert(data.message);
                    location.href = '/feed.html';
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // to handle change in selected files
        fileChanged(e) {
            this.fileUpdated = true;

            // set files
            this.files = e.target.files;
            // clear selectedLinks, errors and invalidFiles
            this.selectedLinks = [];
            this.errors = [];
            this.invalidFiles = [];

            // valid conditions
            const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxImageSize = 2 * 1024 * 1024;
            const maxImageCount = 10;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(', ')}`;
            const largeFile = `File is too large, maximum file size is ${maxImageSize / 1024 / 1024}MB.`;
            const exceedFileCount = `File limit reached, up to ${maxImageCount} files are allowed.`;

            // check for too many images, large images, and invalid file types
            if (e.target.files.length > maxImageCount) {
                this.errors.push(exceedFileCount);
            }

            for (let i = 0; i < e.target.files.length; i++) {
                const currentImage = e.target.files[i];

                if (currentImage.size > maxImageSize) {
                    this.errors.push(largeFile);
                    this.invalidFiles.push(i);
                }

                if (!acceptedFileTypes.includes(currentImage.type)) {
                    this.errors.push(illegalFileType);
                    this.invalidFiles.push(i);
                }
            }

            // return if there are errors
            if (this.errors.length > 0) {
                return;
            }

            // otherwise preview images
            for (let i = 0; i < this.files.length; i++) {
                this.selectedLinks.push(URL.createObjectURL(this.files[i]));
            }
        },
        // to clear files and errors on reset
        resetAll() {
            this.files = [];
            this.errors = [];
            this.caption = "";
            this.location = "";
            this.tags = [];
            this.comments = false;
        },
        // to calculate size of file and display message
        calculateSize(bytes) {
            if (bytes < 1024) {
                return `${bytes}B`;
            }
            else {
                const kilobytes = Math.floor(bytes / 1024);

                if (kilobytes < 1024) {
                    return `${kilobytes}KB`;
                }
                else {
                    const megabytes = Math.floor(kilobytes / 1024);

                    if (megabytes < 1024) {
                        return `${megabytes}MB`;
                    }

                    else {
                        return `${Math.floor(megabytes / 1024)}GB`;
                    }
                }
            }
        },
        // download images and save as files
        async downloadExistingImages() {
            const imagePromises = this.selectedLinks.map((link, index) => {
                return fetch(link).then(async (res) => {
                    if (res.status == 200) {
                        await res.blob().then((blob) => {
                            const imageName = `${this.blog.original_names[index]}`;
                            const image = new File([blob], imageName, {
                                type: blob.type
                            });

                            this.files.push(image);
                            this.dataTransfer.items.add(image);
                        });
                    }
                    else {
                        console.log('Failed to retrieve image.');
                    }
                }).catch((error) => {
                    console.log(error);
                });
            });

            await Promise.all(imagePromises).catch((error) => {
                console.log(error);
            });
        },
        // to clear blog store
        clearBlogStore() {
            const store = useBlogStore();
            store.blogToEdit = {};
        }
    },
    async created() {
        // check if store is empty
        // go back to feed if store is empty
        const store = useBlogStore();
        if (JSON.stringify(store.blogToEdit) == JSON.stringify({})) {
            location.href = '/feed.html';
        }

        // initialize data
        await this.initData();

        // set event listener to clear blog store when the page is closed
        window.addEventListener('beforeunload', this.clearBlogStore);
    },
    updated() {
        // check if need to init files of file input
        // if true then set the existing files and set toInitFiles to false
        if (this.toInitFiles) {
            document.getElementById('upload-image').files = this.dataTransfer.files;

            this.toInitFiles = false;
        }
    },
    unmounted() {
        // clear blog store
        this.clearBlogStore();
    }
}
</script>

<style>
#edit-blog-form {
    padding: 40px;
    border-style: solid;
    border-color: black;
    border-width: 2.9px;
    border-radius: 10px;
    text-align: center;
    background-color: #133B5B;
    color: white;
    width: 45%;
}
#custom-btn {
    width: fit-content !important;
    height: fit-content !important;
    margin-left: 0 !important;
    margin-top: 5px !important;
}
.form-header {
    align-items: center;
    margin-bottom: 1rem;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: white;
    float: right;
}

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

#upload-image-container {
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 30px !important;
    width: 80% !important;
    height: fit-content;
    display: grid;
    row-gap: 10px;
    align-items: center;
    background-color: white;
    color: black;
}

#upload-image {
    opacity: 0;
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
}

#upload-image-label {
    width: fit-content;
    height: fit-content;
    margin: auto;
}

#upload-image-errors, .invalidFile {
    color: red;
    font-style: italic;
}

#upload-image-container ul {
    list-style-type: none;
    padding: 0;
}

#caption-title {
    width: fit-content;
    margin-left: 8%;
    margin-right: 2%;
}

#image-caption {
    width: 60%;
    border-radius: 10px;
    border: 1px solid black;
    padding: 15px;
    font-size: 14px;
}

#location-title {
    width: fit-content;
    margin-left: 8%;
    margin-right: 1%;
    display: grid;
    align-items: center;
}

#image-location {
    width: 59.5%;
    border-radius: 10px;
    border: 1px solid black;
    padding: 10px;
    padding-left: 15px;
    font-size: 12px;
}

#tags-title {
    width: fit-content;
    margin-left: 8%;
    margin-right: 4%;
    display: grid;
    align-items: center;
}

#interest-badges {
    width: fit-content;
}

#comments-title {
    width: fit-content;
    margin-left: 8%;
    margin-right: 1%;
    display: grid;
    align-items: center;
}

/* The switch - the box around the slider */
.container {
    width: 4.8rem;
    height: 31px;
    position: relative;
    margin-right: 2rem;
}

/* Hide default HTML checkbox */
.checkbox {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.switch {
    width: 100%;
    height: 100%;
    display: block;
    background-color: #e9e9eb;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease-out;
}

/* The slider */
.slider {
    width: 27px;
    height: 27px;
    position: absolute;
    left: calc(50% - 27px/2 - 10px);
    top: calc(50% - 27px/2);
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-out;
    cursor: pointer;
}

.checkbox:checked + .switch {
    background-color: #34C759;
}

.checkbox:checked + .switch .slider {
    left: calc(50% - 27px/2 + 10px);
    top: calc(50% - 27px/2);
}

.preview-image-container {
    margin: 0 auto;
    margin-bottom: 12px;
    border-style: dotted;
    border-width: 1px;
    border-color: black;
    border-radius: 10px;
    width: 80%;
    padding: 10px;
}

.preview-image-container img {
    width: 150px;
    height: 100px;
    object-fit: cover;
    margin-right: 15px;
    float:left;
}

.preview-image-container span {
    overflow-wrap: break-word;
}

.pink-button {
    background-color: #E53A73;
    border: none;
    border-radius: 7px;
    padding: 10px;
    color: white;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    margin-left: 5%;
    margin-right: 5%;
    width: 170px;
}
</style>