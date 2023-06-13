<template>
    <h1>Edit Post</h1>

    <div v-if="!initialized">
        <p>Loading...</p>
    </div>

    <!-- form to upload images -->
    <form id="edit-blog-form" @submit.prevent="submitForm" v-if="initialized">
        <div id="upload-image-container" class="container-fluid">
            <div class="row">
                <!-- input to select images -->
                <input type="file" id="upload-image" multiple @change="fileChanged" accept=".jpg, .jpeg, .png" />
                <label for="upload-image" id="upload-image-label">
                    <p>Drag and drop or click <u>here</u> to upload.</p>
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
        <input type="reset" value="Clear Selection" @click="resetAll" />
        <!-- 
            disable submit button if 
            1. there are no files selected
            2. there are files selected but contains errors
        -->
        <input type="submit" :value="submitting ? 'Updating...' : 'Update!'" :disabled="files.length == 0 || (files.length > 0 && errors.length > 0) || submitting" />
    </form>
</template>

<script>
import { useBlogStore } from '../../stores/BlogStore.js';

export default {
    data() {
        return {
            blog: {},
            files: [],
            errors: [],
            selectedLinks: [],
            invalidFiles: [],
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
    border-width: 3px;
    border-radius: 10px;
    text-align: center;
}

#upload-image-container {
    border-style: solid;
    border-color: black;
    border-width: 1px;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 40px;
    width: 60%;
    height: fit-content;
    display: grid;
    row-gap: 10px;
    align-items: center;
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
</style>