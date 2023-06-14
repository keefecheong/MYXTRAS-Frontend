<template>
    <div id="overlay">
        <!-- form to upload images -->
        <form id="create-blog-form" @submit.prevent="submitForm">
            <button class="close-button" @click="$router.go(-1)">
                <i class="bi bi-x"></i>
            </button>
            <h1 class="form-header">Create New Post</h1>
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
            <input class="pink-button" type="reset" value="Clear Selection" @click="resetAll" />
            <!-- 
                disable submit button if 
                1. there are no files selected
                2. there are files selected but contains errors
            -->
            <input class="pink-button disabled" type="submit" :value="submitting ? 'Posting...' : 'Post!'" :disabled="files.length == 0 || (files.length > 0 && errors.length > 0) || submitting" />
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            errors: [],
            selectedLinks: [],
            invalidFiles: [],
            submitting: false
        }
    },
    methods: {
        // to handle form submission
        async submitForm(e) {
            this.submitting = true;

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
            console.log(formData.get('selectedImages'))

            // send request to backend server with data
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts`, {
                mode: 'cors',
                method: 'POST',
                body: formData,
                credentials: 'include'
            }).then((res) => {
                // reset form
                this.submitting = false;
                
                e.target.reset();
                this.resetAll();

                res.json().then((data) => {
                    alert(data.message);
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        // to handle change in selected files
        fileChanged(e) {
            // set files
            this.files = e.target.files;
            // clear errors and invalidFiles
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
            this.selectedLinks = [];
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
        }
    }
}
</script>

<style>
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

#create-blog-form {
    padding: 40px;
    border-style: solid;
    border-color: black;
    border-width: 2.9px;
    border-radius: 10px;
    text-align: center;
    background-color: #133B5B;
    color: white;
    width: 35%;
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