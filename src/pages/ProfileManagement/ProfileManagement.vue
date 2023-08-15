<template>
    <div id="main-container">
        <NavSidebar />
        <div id="main-content">
            <LoadingOverlay
                v-if="loading || childLoading"
                :center="true"
                :backgroundColor="'rgba(0, 0, 0, 0.5)'"
            />

            <div class="banner">
                <img :src="banner" alt="Banner" id="banner-picture" />
                <div class="content">
                    <input
                        ref="bannerInput"
                        type="file"
                        @change="upload($event, 'banner')"
                        style="display: none"
                        accept=".jpg, .jpeg, .png"
                    />
                    <button class="banner-button" @click="chooseFile('banner')">
                        Customize banner
                    </button>
                </div>
            </div>

            <div id="profile-picture-container">
                <div class="content">
                    <div class="image-container">
                        <img
                            :src="profilePicture"
                            alt="Profile Picture"
                            id="profile-picture"
                        />
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        @change="upload($event, 'profilePicture')"
                        style="display: none"
                        accept=".jpg, .jpeg, .png"
                    />
                    <button
                        v-if="!showBtn"
                        class="profile-picture-button"
                        @click="chooseFile('profilePicture')"
                    >
                        Change Profile Picture
                    </button>
                </div>
            </div>

            <div v-if="showPopup" id="popup-container">
                <div>
                    <button
                        type="button"
                        id="close-add-interest"
                        class="material-symbols-outlined"
                        @click="() => togglePopup(false)"
                    >
                        Close
                    </button>

                    <div id="popup-content">
                        <div id="selection-header">
                            <slot>Crop Image</slot>
                        </div>
                        <img
                            :src="profilePicture"
                            alt="Profile Picture"
                            id="profile-picture"
                            ref="cropperImage"
                        />
                        <div id="button-cotainer">
                            <button id="confirm-btn" @click="confirmCropping">
                                Confirm Crop
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-3 row" id="position">
                <label
                    for="inputUsername"
                    class="col-md-1 offset-md-4 col-form-label"
                    >Username: @</label
                >
                <div class="col-sm-4">
                    <input
                        type="username"
                        v-model="username"
                        class="form-control"
                        id="inputUsername"
                        placeholder="Username"
                        @input="verifyUsername"
                        :maxlength="25"
                    />
                    <p style="color: red; margin-top: 20px; margin-left: 125px">
                        {{ this.usernameErr }}
                    </p>
                </div>
            </div>

            <div class="mb-3 row" id="position">
                <label
                    for="inputBio"
                    class="col-md-1 offset-md-4 col-form-label"
                    >Bio:
                </label>
                <div class="col-sm-4">
                    <input
                        type="biography"
                        v-model="biography"
                        class="form-control"
                        id="inputBio"
                        placeholder="Biography"
                    />
                </div>
            </div>

            <div class="mb-3 row" id="position">
                <label
                    for="inputInterest"
                    class="col-md-1 offset-md-4 col-form-label"
                    >Interest:
                </label>
                <div class="col-sm-4" v-if="dataRetrieved">
                    <AddInterestButton
                        :selectedOption="selectedOption"
                        @selectedInterests="handleSelectedInterests"
                    />
                </div>
            </div>

            <div id="profile">
                <div class="warningbox col-md-4 offset-md-1">
                    <p>
                        <b>Personal Information</b> - This will only be recorded
                        for user analytics. This will not be shown to the
                        public.
                    </p>
                </div>
            </div>

            <div class="mb-3 row" id="position">
                <label
                    for="inputGender"
                    class="col-md-1 offset-md-4 col-form-label"
                    >Gender:
                </label>
                <div class="col-sm-4">
                    <input
                        type="gender"
                        v-model="gender"
                        class="form-control"
                        id="inputGender"
                        placeholder="Gender"
                    />
                </div>
            </div>

            <!-- <div class="mb-3 row" id="position">
                <label for="inputEmail" class="col-md-1 offset-md-4 col-form-label">Secondary Email: </label>
                <div class="col-sm-4">
                    <input type="email" v-model="secondaryEmail" class="form-control" id="inputEmail" placeholder="Email">
                </div>
            </div> -->

            <div class="submitbutton" style="margin: 30px" id="profile">
                <button
                    class="submit-button"
                    @click="updateProfile()"
                    :disabled="!verifiedUsername"
                    :class="{ disabled: !verifiedUsername }"
                >
                    Update
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AddInterestButton from "../../components/general/AddInterestButton.vue";
import ngeeann from "../../assets/NgeeAnnLogo.png";
import banner from "../../assets/CustomBanner.png";
import Cropper from "cropperjs";
import { debounce } from "lodash";
import LoadingOverlay from "../../components/general/LoadingOverlay.vue";

export default {
    components: {
        AddInterestButton,
        Cropper,
        ngeeann,
        banner,
        LoadingOverlay,
    },

    data() {
        return {
            showPopup: false,
            selectedOption: [],
            cropper: null,
            profilePicture: ngeeann,
            banner: banner,
            username: "",
            biography: "",
            gender: "",
            // secondaryEmail: '',
            showBtn: false,
            dataRetrieved: false,
            usernameErr: null,
            // selectedBanner: "banner",
            // selectedProfilePic: "profilePicture",
            debouncedVerifyUsername: null,
            verifiedUsername: true,
            previousUsername: null,
            loading: false,
        };
    },
    created() {
        // set debounce functions
        this.debouncedVerifyUsername = debounce(
            this.debounceVerifyUsernameFunction,
            1000,
        );
    },
    mounted() {
        this.checkAuth();
    },

    methods: {
        checkAuth() {
            // Ensure that its 127.0.0.1 and not localhost as Google Chrome may not send cookies for cross-site requests on localhost.
            fetch(`${process.env.APP_SERVER_URL}/api/users/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                credentials: "include",
            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            if (data.is_profile_setup === false) {
                                window.location.href = "/setupProfile.html";
                                return;
                            } else {
                                this.username = data.username;
                                this.previousUsername = this.username;
                                this.biography = data.biography;
                                this.selectedOption = data.interests;
                                this.gender = data.gender;
                                this.userId = data._id;
                                this.profilePicture = data.profile_pic_link;
                                this.banner = data.banner_pic_link;
                                this.dataRetrieved = true;
                            }
                        });
                    } else {
                        console.log("Error:", response);
                    }
                })
                .then((data) => {
                    console.log("Success:", data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },

        initializeCropper() {
            const imageElement = this.$refs.cropperImage;
            this.cropper = new Cropper(imageElement, {
                aspectRatio: 1, // Set the aspect ratio for the cropped image
                viewMode: 1, // Restrict the cropping area to the container size
                dragMode: false, // Prevent dragging the image within the container
                cropBoxResizable: true, // Disable resizing of the cropping area
                cropBoxMovable: true, // Disable moving of the cropping area
                toggleDragModeOnDblclick: true, // Disable toggling drag mode on double-click
                guides: false, // Hide the grid lines
                background: false, // Disable the background overlay
                ready: () => {
                    this.cropper.setCropBoxData({
                        width: 142,
                        height: 142,
                        left: (imageElement.offsetWidth - 142) / 2,
                        top: (imageElement.offsetHeight - 142) / 2,
                    });
                },
            });
        },

        chooseFile(imageType) {
            if (imageType === "profilePicture") {
                this.$refs.fileInput.value = ""; // Reset the file input value
                this.$nextTick(() => {
                    this.$refs.fileInput.click(); // Open the file input dialog
                });
            } else {
                this.$refs.bannerInput.click();
            }
        },

        upload(event, imageType) {
            // clear errors, invalidFiles and selectedLinks
            this.errors = [];
            this.invalidFiles = [];
            this.selectedLinks = [];

            // valid conditions
            const acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(
                ", ",
            )}`;
            const largeFile = `File is too large, maximum file size is ${
                maxImageSize / 1024 / 1024
            }MB.`;

            const file = event.target.files[0];
            if (file.size > maxImageSize) {
                this.errors.push(largeFile);
                this.invalidFiles.push(i);
            }

            if (!acceptedFileTypes.includes(file.type)) {
                this.errors.push(illegalFileType);
                this.invalidFiles.push(i);
            }
            // return if there are errors
            if (this.errors.length > 0) {
                return;
            }

            if (imageType === "profilePicture") {
                this.profilePicture = URL.createObjectURL(file);
                this.showBtn = true;
                this.$nextTick(() => {
                    this.showPopup = true;
                    this.$nextTick(() => {
                        this.initializeCropper();
                    });
                });
            } else {
                this.banner = URL.createObjectURL(file);
                // Extract original image name and type from the file input
                const originalName = this.$refs.bannerInput.files[0].name;
                const originalType = this.$refs.bannerInput.files[0].type;

                fetch(this.banner)
                    .then((response) => response.blob())
                    .then((blob) => {
                        // Create a new File object with the cropped image data
                        const croppedFile = new File([blob], originalName, {
                            type: originalType,
                        });

                        // Assign the cropped File object to a separate variable
                        this.croppedBannerFile = croppedFile;
                    });
                console.log(this.croppedBannerFile);
            }
        },

        confirmCropping() {
            const croppedCanvas = this.cropper.getCroppedCanvas({
                width: 142,
                height: 142,
                fillColor: "#fff",
            });
            const croppedImage = croppedCanvas.toDataURL(); // Get the cropped image as a data URL

            // Extract original image name and type from the file input
            const originalName = this.$refs.fileInput.files[0].name;
            const originalType = this.$refs.fileInput.files[0].type;
            fetch(croppedImage)
                .then((response) => response.blob())
                .then((blob) => {
                    // Create a new File object with the cropped image data
                    const croppedFile = new File([blob], originalName, {
                        type: originalType,
                    });

                    // Assign the cropped File object to a separate variable
                    this.croppedImageFile = croppedFile;

                    this.profilePicture = croppedImage;
                    this.cropper.destroy(); // Destroy the cropper instance
                    this.cropper = null; // Set the cropper variable to null
                    this.togglePopup(false);
                    this.showBtn = false;
                });
            console.log(this.croppedImageFile);
        },

        async debounceVerifyUsernameFunction() {
            try {
                const response = await fetch(
                    `${
                        process.env.APP_SERVER_URL
                    }/api/users/verify/username`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                        credentials: "include",
                        body: JSON.stringify({ username: this.username }),
                    },
                );

                if (response.ok) {
                    this.verifiedUsername = true;
                    this.usernameErr = null;
                    return;
                } else if (response.status === 400) {
                    const data = await response.json();

                    if (data.message === "Username already exists") {
                        this.verifiedUsername = false;
                        this.usernameErr = "Username already taken";
                        return;
                    } else {
                        throw new Error("Error: " + response.status);
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            }
        },
        async verifyUsername() {
            // If user changes from a taken username back to their username, enable button and clear err
            if (this.username != this.previousUsername) {
                this.verifiedUsername = false;
                this.debouncedVerifyUsername();
            } else {
                this.verifiedUsername = true;
                this.usernameErr = "";
            }
        },
        async updateProfile() {
            this.loading = true;

            let formData = new FormData();

            this.userObject = {
                userName: this.username,
                biography: this.biography,
                selectedInterests: this.selectedOption,
                gender: this.gender,
            };

            try {
                formData.append("userObject", JSON.stringify(this.userObject));

                formData.append(
                    "selectedImages",
                    this.croppedImageFile,
                    "profilePicture",
                );

                formData.append(
                    "selectedImages",
                    this.croppedBannerFile,
                    "banner",
                );

                const response = await fetch(
                    `${process.env.APP_SERVER_URL}/api/users/profile`,
                    {
                        method: "PATCH",
                        body: formData,
                        credentials: "include",
                    },
                );

                if (response.ok) {
                    window.location.href = "/profilePage.html";
                } else {
                    console.log("Error:", response.statusText);
                }
            } catch (error) {
                console.log("Error:", error);
            }

            this.loading = false;
        },

        handleSelectedInterests(selectedOption) {
            this.selectedOption = selectedOption;
        },

        togglePopup(show) {
            this.showPopup = show;
        },

        // handle child loading
        toggleChildLoading(loading) {
            this.childLoading = loading;
        },
    },
};
</script>

<style scoped>
.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

body {
    margin: 0;
    padding: 0;
}

.banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    width: 100%;
    background-color: #f1f1f1;
}

#banner-picture {
    height: 150px;
    width: 100%;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}

.banner-button {
    background-color: #e53a73;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    border-radius: 10px;
    font-weight: bold;
    position: absolute;
}

.profile-picture-button {
    background-color: transparent;
    color: #e53a73;
    padding: 10px 20px;
    text-align: center;
    border-radius: 10px;
    /* position: absolute;
    top: 355px; */
    font-weight: bold;
    border: 2px solid #e53a73;
}

.confirm-button {
    background-color: transparent;
    color: #e53a73;
    padding: 10px 20px;
    text-align: center;
    font-size: 10px;
    border-radius: 10px;
    position: absolute;
    margin-top: 235px;
    font-weight: bold;
    border: 2px solid #e53a73;
}

.submit-button {
    background-color: #e53a73;
    border: none;
    color: white;
    padding: 20px 50px;
    text-align: center;
    border-radius: 10px;
    margin-top: 50px;
    font-weight: bold;
}

#profile-picture-container {
    margin-top: 80px;
}

#profile-picture {
    margin: auto;
    text-align: center;
    display: block;
    border-radius: 50%;
    border: 1px solid black;
    height: 142px;
    width: 142px;
}

#profile {
    margin: 20px;
    justify-content: center;
    display: flex;
    align-items: center;
}

.warningbox {
    background-color: #686868;
    border: none;
    color: white;
    border-radius: 10px;
    padding: 20px;
    font-size: 15px;
}

#position {
    margin: 50px 0px;
}

#popup-content {
    background-color: #fff;
    color: black;
    padding: 20px 200px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    align-items: center;
}

#popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5) !important;
    /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
}

#popup-container > div {
    position: relative;
}

#close-add-interest {
    position: absolute;
    right: 15px;
    top: 15px;
    color: black;
}

#confirm-btn {
    width: 10em;
    color: white;
    border: none;
    background: linear-gradient(45deg, #ff6363, #e53a73);
    border-radius: 10px;
    padding: 10px 12px;
}

#selection-header {
    font-weight: bold;
    font-size: 1.2em;
}

.cropper-crop-box,
.cropper-view-box {
    border-radius: 50%;
}

.cropper-view-box {
    box-shadow: 0 0 0 1px #39f;
    outline: 0;
}

.cropper-modal {
    height: 75%;
    margin-top: 25px;
}
</style>
