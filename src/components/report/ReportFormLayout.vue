<template>
    <div class="form-overlay">
        <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" v-if="submitting" />

        <form class="form-overlay-content" @submit.prevent="submitReport">
            <button class="form-overlay-close" @click="closeForm" type="button">
                <span class="material-symbols-outlined">Close</span>
            </button>

            <h1>Report {{ type.includes('Comment') ? 'comment' : type }}</h1>

            <!-- input for report reason -->
            <label for="report-reason">Why are you reporting this {{ type.includes('Comment') ? 'comment' : type }}?</label>
            <select name="report-reason" id="report-reason-input" v-model="selectedReason">
                <option value="None" disabled selected hidden>Select an option</option>
                <option v-for="(reason, index) in reasons" :key="index" :value="reason">{{ reason }}</option>
            </select>

            <!-- input for supporting evidence if reporting user -->
            <div v-if="type == 'user'" id="report-evidence-container">
                <label for="report-evidence-input" id="report-evidence-label"><u>Click</u> to Select Picture as Evidence (Optional)</label>
    
                <span v-if="evidenceObject && errors.length > 0" class="errMsg">Invalid file</span>

                <img v-if="evidenceLink" :src="evidenceLink"  id="report-evidence" />
                <input id="report-evidence-input" type="file" @change="fileChanged" accept=".jpg, .jpeg, .png" />
                
                <!-- inform user about invalid file -->
                <div v-if="errors.length > 0">
                    <span>Error:</span>
                    <br />
                    <p v-for="error in errors" class="errMsg">{{ error }}</p>
                </div>
            </div>

            <button class="form-overlay-control-button" :disabled="submitting || !reasons.includes(selectedReason)">{{ submitting ? 'Submitting...' : 'Submit' }}</button>
        </form>
    </div>
</template>

<script>
import LoadingOverlay from '../general/LoadingOverlay.vue';
import { useAlertStore } from '../../stores/AlertStore';
import { useConfirmStore } from '../../stores/ConfirmStore';

export default {
    data() {
        return {
            submitting: false,

            selectedReason: 'None',
            reasons: [
                'Spam',
                'Nudity or sexual activity',
                'Hate speech or symbols',
                'Violence or dangerous organisations',
                'Bullying or harassment',
                'Selling illegal or regulated goods',
                'Intellectual property violations',
                'Suicide or self-injury',
                'Eating disorders',
                'Scams or fraud',
                'False information'
            ],

            evidenceObject: null,
            evidenceLink: null,
            errors: [],

            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm
        }
    },
    components: {
        LoadingOverlay
    },
    props: [
        'type',
        'userId',
        'postId',
        'forumId',
        'threadId',
        'commentId',
        'messageId'
    ],
    emits: [
        'close-report-form'
    ],
    methods: {
        // to close report form
        closeForm() {
            this.$emit('close-report-form');
        },
        // to submit report
        async submitReport() {
            this.submitting = true;

            // if invalid reason is selected then do nothing
            if (!this.reasons.includes(this.selectedReason)) {
                this.submitting = false;

                await this.alert('Invalid report reason');
                return;
            }

            // do nothing if there are errors in the files provided
            if (this.evidenceObject && this.errors.length > 0) {
                this.submitting = false;

                await this.alert('Invalid files selected.');
                return;
            }

            const confirmReport = await this.confirm('Report information cannot be changed, are you sure you want to continue?');

            if (!confirmReport) {
                this.submitting = false;
                return;
            }

            // set url and body based on report type
            let url = `${import.meta.env.VITE_APP_SERVER_URL}/api/report/submit`;

            let body = JSON.stringify({
                reason: this.selectedReason
            });

            let sendingFormData = false;

            switch (this.type) {
                case 'user':
                    url += `/user/${this.userId}`;

                    // if report is for a user and an image is selected then change body to FormData object
                    if (this.evidenceObject) {
                        body = new FormData();

                        body.append('reason', this.selectedReason);
                        body.append('reportEvidence', this.evidenceObject);

                        sendingFormData = true;
                    }

                    break;

                case 'post':
                    url += `/user/${this.userId}/post/${this.postId}`;
                    break;

                case 'forum':
                    url += `/forum/${this.forumId}`;
                    break;

                case 'thread':
                    url += `/forum/${this.forumId}/thread/${this.threadId}`;
                    break;

                case 'postComment':
                    url += `/user/${this.userId}/post/${this.postId}/comment/${this.commentId}`;
                    break;

                case 'threadComment':
                    url += `/forum/${this.forumId}/thread/${this.threadId}/comment/${this.commentId}`;
                    break;

                case 'message':
                    url += `/message/${this.messageId}`;
                    break;

                default:
                    this.submitting = false;

                    await this.alert('Invalid report type.');
                    
                    this.closeForm();
                    break;
            }

            const options = {
                mode: 'cors',
                method: 'POST',
                credentials: 'include',
                body
            };

            if (!sendingFormData) {
                options.headers = {
                    'Content-Type': 'application/json'
                }
            }

            console.log(url)

            // send request
            await fetch(url, options).then(async res => {
                await res.json().then(async data => {
                    await this.alert(data.message);

                    this.closeForm();
                })
            }).catch(error => {
                console.log(error);
            });

            this.submitting = false;
        },
        // to handle change in selected files
        fileChanged(e) {
            this.errors = [];
            
            // if no files selected then clear relevant fields and return
            if (e.target.files.length <= 0) {
                this.evidenceObject = null;
                this.evidenceLink = null;

                return;
            }

            // valid conditions
            const acceptedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(', ')}`;
            const largeFile = `File is too large, maximum file size is ${maxImageSize / 1024 / 1024}MB.`;

            // set relevant fields
            this.evidenceObject = e.target.files[0];
            this.evidenceLink = null;

            // check for errors
            if (this.evidenceObject.size > maxImageSize) {
                this.errors.push(largeFile);
            }

            if (!acceptedFileTypes.includes(this.evidenceObject.type)) {
                this.errors.push(illegalFileType);
            }

            // return if there are errors
            if (this.errors.length > 0) {
                return;
            }

            // otherwise preview images
            this.evidenceLink = URL.createObjectURL(this.evidenceObject);
        }
    }
}
</script>

<style scoped>
label {
    font-size: 1.2em;
    cursor: pointer;
}
</style>

<style>
@import url('../../styles/forms/form-overlay-styles.css');

#report-evidence-container {
    display: flex;
    row-gap: 20px;
    flex-direction: column;
    align-items: center;
    width: 60%;
}

#report-evidence-input {
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    position: absolute;
}

#report-evidence {
    max-width: 100%;
    object-fit: cover;
    object-position: center;
}
</style>