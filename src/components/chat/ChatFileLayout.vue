<template>
    <div
        class="chat-file-layout-container"
        :class="{ 'in-message': inMessage }"
    >
        <!-- layout for image type files -->
        <div class="chat-image-file-layout-container" v-if="isImageFile">
            <img class="chat-image-file" :src="fileLink" />
        </div>

        <!-- layout for non-image type files -->
        <div class="chat-non-image-file-layout-container" v-else>
            <img
                class="chat-placeholder-image"
                src="../../assets/unknown-file-icon.png"
            />
            <span>{{ originalName }}</span>
        </div>

        <div style="position: relative" v-if="inMessage">
            <span
                class="material-symbols-outlined"
                :class="{ 'hide-download': downloadingFile }"
                title="Download file"
                @click="downloadFile"
                >Download</span
            >

            <!-- custom styles for loading wheel -->
            <LoadingOverlay
                v-if="downloadingFile"
                style="
                    height: 100%;
                    width: 100%;
                    position: absolute;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 50%;
                "
            />
        </div>
    </div>
</template>

<script>
import LoadingOverlay from "../general/LoadingOverlay.vue";

export default {
    data() {
        return {
            downloadingFile: false,
        };
    },
    components: {
        LoadingOverlay,
    },
    props: ["fileLink", "originalName", "fileType", "inMessage"],
    methods: {
        async downloadFile() {
            this.downloadingFile = true;

            await fetch(this.fileLink)
                .then(async (res) => {
                    if (res.status == 200) {
                        await res.blob().then((blob) => {
                            const aElement = document.createElement("a");
                            aElement.href = URL.createObjectURL(blob);
                            aElement.download = this.originalName;
                            aElement.target = "_blank";
                            aElement.click();
                        });
                    } else {
                        console.log("Failed to retrieve image.");
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            this.downloadingFile = false;
        },
    },
    computed: {
        isImageFile() {
            return this.fileType.startsWith("image/");
        },
    },
};
</script>

<style>
.chat-file-layout-container {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: center;
    padding: 10px;
    padding-right: 20px;
}

.chat-file-layout-container.in-message {
    border-bottom: 1px solid white;
    margin-bottom: 5px;
}

.chat-file-layout-container .material-symbols-outlined {
    font-size: 2em;
}

.chat-file-layout-container .material-symbols-outlined.hide-download {
    color: rgba(211, 211, 211, 0.5);
}

.in-message .chat-image-file {
    max-width: 30vw;
}

.chat-image-file {
    max-width: 10vw;
}

.chat-non-image-file-layout-container {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
}

.chat-placeholder-image {
    max-width: 30px;
}
</style>
