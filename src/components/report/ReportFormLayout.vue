<template>
    <div class="form-overlay">
        <LoadingOverlay
            :backgroundColor="'rgba(0, 0, 0, 0.5)'"
            :center="true"
            v-if="submitting"
        />

        <form class="form-overlay-content" @submit.prevent="submitReport">
            <button
                class="form-overlay-close"
                @click="() => closeForm(false)"
                type="button"
            >
                <span class="material-symbols-outlined">Close</span>
            </button>

            <h1>
                {{ resolve ? "Resolve" : "Report" }}
                {{ type.includes("Comment") ? "comment" : type }}
            </h1>

            <!-- input for choosing action if resolving report -->
            <div v-if="resolve" class="report-form-selection-container">
                <label
                    for="resolve-report-action-input"
                    id="resolve-report-action-label"
                    >Action after resolving report:</label
                >

                <select
                    id="resolve-report-action-input"
                    v-model="selectedResolveAction"
                >
                    <option value="" disabled selected hidden>
                        Select an action
                    </option>
                    <option
                        v-for="action in resolveActions"
                        :value="action"
                        :hidden="hideAction(action)"
                    >
                        {{ action }}
                    </option>
                </select>
            </div>

            <!-- input for entering suspend duration if resolving report and suspending user -->
            <div
                v-if="
                    resolve && selectedResolveAction == RESOLVE_ACTION_SUSPEND
                "
                class="report-form-selection-container"
            >
                <label for="suspend-duration"
                    >Suspend user for: (minutes)</label
                >

                <input
                    type="number"
                    id="suspend-duration"
                    min="0"
                    step="1"
                    v-model="suspendDuration"
                />
            </div>

            <!-- input for report reason -->
            <div
                v-if="
                    !resolve ||
                    (resolve &&
                        selectedResolveAction &&
                        selectedResolveAction != RESOLVE_ACTION_NONE)
                "
                class="report-form-selection-container"
            >
                <label for="report-reason-input">{{ formTitle }}</label>

                <select id="report-reason-input" v-model="selectedReason">
                    <option value="" disabled selected>
                        Select a reason for reporting
                    </option>
                    <option v-for="reason in reasons" :value="reason">
                        {{ reason }}
                    </option>
                </select>
            </div>

            <!-- input for description if report reason is 'Other' -->
            <div
                v-if="selectedReason == 'Other'"
                class="report-form-selection-container"
            >
                <DynamicTextarea
                    v-model="otherReason"
                    :placeholder="'Please elaborate...'"
                    :maxRows="5"
                />
            </div>

            <!-- input for supporting evidence if reporting user -->
            <div
                v-if="type == 'user' && !resolve"
                id="report-evidence-container"
            >
                <label for="report-evidence-input" id="report-evidence-label"
                    ><u>Click</u> to Select Picture as Evidence
                    (Optional)</label
                >

                <span v-if="evidenceObject && errors.length > 0" class="errMsg"
                    >Invalid file</span
                >

                <img
                    v-if="evidenceLink"
                    :src="evidenceLink"
                    id="report-evidence"
                />
                <input
                    id="report-evidence-input"
                    type="file"
                    @change="fileChanged"
                    accept=".jpg, .jpeg, .png"
                />

                <!-- inform user about invalid file -->
                <div v-if="errors.length > 0">
                    <span>Error:</span>
                    <br />
                    <p v-for="error in errors" class="errMsg">{{ error }}</p>
                </div>
            </div>

            <button
                class="form-overlay-control-button"
                :disabled="submitting || !enableSubmit"
            >
                {{ submitting ? "Submitting..." : "Submit" }}
            </button>
        </form>
    </div>
</template>

<script>
import LoadingOverlay from "../general/LoadingOverlay.vue";
import { useAlertStore } from "../../stores/AlertStore.js";
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import DynamicTextarea from "../general/DynamicTextarea.vue";

export default {
    data() {
        return {
            submitting: false,

            selectedReason: "",
            reasons: [
                "Spam",
                "Nudity or sexual activity",
                "Hate speech or symbols",
                "Violence or dangerous organisations",
                "Bullying or harassment",
                "Selling illegal or regulated goods",
                "Intellectual property violations",
                "Suicide or self-injury",
                "Eating disorders",
                "Scams or fraud",
                "False information",
                "Other",
            ],
            otherReason: "",

            evidenceObject: null,
            evidenceLink: null,
            errors: [],

            selectedResolveAction: "",
            RESOLVE_ACTION_NONE: "None",
            RESOLVE_ACTION_DELETE: "Delete content",
            RESOLVE_ACTION_SUSPEND: "Suspend user",
            RESOLVE_ACTION_TERMINATE: "Terminate user",
            resolveActions: null,

            // duration to suspend user, in minutes
            suspendDuration: 0,

            alert: useAlertStore().alert,
            confirm: useConfirmStore().confirm,
        };
    },
    created() {
        this.resolveActions = [
            this.RESOLVE_ACTION_NONE,
            this.RESOLVE_ACTION_DELETE,
            this.RESOLVE_ACTION_SUSPEND,
            this.RESOLVE_ACTION_TERMINATE,
        ];
    },
    components: {
        LoadingOverlay,
        DynamicTextarea,
    },
    props: [
        "type",
        "userId",
        "postId",
        "forumId",
        "threadId",
        "commentId",
        "messageId",
        "resolve",
    ],
    emits: ["close-report-form"],
    computed: {
        // to generate label for selecting report reason
        formTitle() {
            const reportType = this.type.includes("Comment")
                ? "Comment"
                : this.type;

            return !this.resolve
                ? `Why are you reporting this ${reportType}?`
                : `Resolve report for ${reportType}:`;
        },
        // to check if fields are valid to enable submit
        // submit allowed: 1. if resolving, when a valid resolve action and reason is selected, 2. otherwise, when a valid reason is selected
        enableSubmit() {
            const validAction =
                this.resolve &&
                this.resolveActions.includes(this.selectedResolveAction);
            const validReason =
                this.reasons.includes(this.selectedReason) &&
                (this.selectedReason != "Other" ||
                    (this.selectedReason == "Other" && this.otherReason));

            const validResolve =
                validAction &&
                (this.selectedResolveAction == this.RESOLVE_ACTION_NONE ||
                    validReason) &&
                (this.selectedResolveAction != this.RESOLVE_ACTION_SUSPEND ||
                    (this.selectedResolveAction ==
                        this.RESOLVE_ACTION_SUSPEND &&
                        this.suspendDuration > 0));

            const validReport = !this.resolve && validReason;

            return validResolve || validReport;
        },
    },
    methods: {
        // to close report form
        closeForm(submitted, resolveDetails) {
            this.$emit("close-report-form", submitted, resolveDetails);
        },
        // to submit report
        async submitReport() {
            this.submitting = true;

            if (this.resolve) {
                // if resolving report, check if actions is valid
                if (!this.resolveActions.includes(this.selectedResolveAction)) {
                    this.submitting = false;

                    await this.alert("Invalid resolve action.");
                    return;
                }

                // if resolving report to suspend user, check if suspendDuration is valid
                if (
                    this.selectedResolveAction == this.RESOLVE_ACTION_SUSPEND &&
                    !this.suspendDuration
                ) {
                    this.submitting = false;

                    await this.alert("Invalid suspend duration.");
                    return;
                }
            }

            // if invalid reason is selected then do nothing
            if (!this.reasons.includes(this.selectedReason)) {
                if (
                    !(
                        this.resolve &&
                        this.selectedResolveAction == this.RESOLVE_ACTION_NONE
                    )
                ) {
                    this.submitting = false;

                    await this.alert("Invalid report reason");
                    return;
                }
            }
            // check if otherReason is valid if reason is 'Other'
            else if (this.selectedReason == "Other") {
                if (!this.otherReason) {
                    this.submitting = false;

                    await this.alert('Description required for reason "Other"');
                }
            }

            // do nothing if there are errors in the files provided
            if (this.evidenceObject && this.errors.length > 0) {
                this.submitting = false;

                await this.alert("Invalid files selected.");
                return;
            }

            const confirmReport = await this.confirm(
                "This operation cannot be reversed, are you sure you want to continue?",
            );

            if (!confirmReport) {
                this.submitting = false;
                return;
            }

            // set url and body based on report type
            let url;
            const failedReport =
                this.resolve &&
                this.selectedResolveAction == this.RESOLVE_ACTION_NONE;

            if (this.resolve) {
                url = `${
                    process.env.APP_SERVER_URL
                }/api/admin/report/resolve`;

                if (failedReport) {
                    url += "/failed";
                } else {
                    url += "/success";
                }
            } else {
                url = `${
                    process.env.APP_SERVER_URL
                }/api/report/submit`;
            }

            let body = {
                reason: this.selectedReason,
                otherReason: this.otherReason,
            };

            let sendingFormData = false;
            let objectId;

            // set url based on type of report
            switch (this.type.toLowerCase()) {
                case "user":
                    if (this.resolve) {
                        if (failedReport) {
                            objectId = this.userId;

                            break;
                        }

                        const toTerminate =
                            this.selectedResolveAction ==
                            this.RESOLVE_ACTION_TERMINATE;

                        url += `/user/${this.userId}/${
                            toTerminate ? "terminate" : "suspend"
                        }`;

                        // add suspendDuration if to suspend user
                        if (!toTerminate) {
                            // convert suspendDuration to milliseconds
                            body.duration = this.suspendDuration * 60 * 1000;
                        }

                        break;
                    }
                    // if submitting report for a user and an image is selected then change body to FormData object
                    else if (this.evidenceObject) {
                        body = new FormData();

                        body.append("reason", this.selectedReason);
                        body.append("reportEvidence", this.evidenceObject);

                        sendingFormData = true;
                    }

                    url += `/user/${this.userId}`;

                    break;

                case "post":
                    if (failedReport) {
                        objectId = this.postId;

                        break;
                    }

                    url += `/user/${this.userId}/post/${this.postId}`;

                    break;

                case "forum":
                    if (failedReport) {
                        objectId = this.forumId;

                        break;
                    }

                    url += `/forum/${this.forumId}`;

                    break;

                case "thread":
                    if (failedReport) {
                        objectId = this.threadId;

                        break;
                    }

                    url += `/forum/${this.forumId}/thread/${this.threadId}`;

                    break;

                case "postcomment":
                    if (failedReport) {
                        objectId = this.commentId;

                        break;
                    }

                    url += `/user/${this.userId}/post/${this.postId}/comment/${this.commentId}`;

                    break;

                case "threadcomment":
                    if (failedReport) {
                        objectId = this.commentId;

                        break;
                    }

                    url += `/forum/${this.forumId}/thread/${this.threadId}/comment/${this.commentId}`;

                    break;

                case "message":
                    if (failedReport) {
                        objectId = this.messageId;

                        break;
                    }

                    url += `/message/${this.messageId}`;

                    break;

                default:
                    this.submitting = false;

                    await this.alert("Invalid report type.");

                    this.closeForm(false);
                    break;
            }

            // centrally update url if resolve report with no action
            if (failedReport) {
                url += `/${objectId}`;
            }

            const options = {
                mode: "cors",
                method: this.resolve ? "PATCH" : "POST",
                credentials: "include",
                body,
            };

            // if not sending formData then stringify body and set headers
            if (!sendingFormData) {
                options.body = JSON.stringify(body);
                options.headers = {
                    "Content-Type": "application/json",
                };
            }

            // send request
            await fetch(url, options)
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        await this.alert(data.message);

                        this.closeForm(true, data.resolveDetails);
                    });
                })
                .catch((error) => {
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
            const acceptedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
            const maxImageSize = 2 * 1024 * 1024;

            // error messages
            const illegalFileType = `Illegal file type, allowed file types: ${acceptedFileTypes.join(
                ", ",
            )}`;
            const largeFile = `File is too large, maximum file size is ${
                maxImageSize / 1024 / 1024
            }MB.`;

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
        },
        // hide terminate and suspend if resolving reports for anything other than user
        // hide delete if resolving reports for user
        hideAction(action) {
            return (
                (this.type != "User" &&
                    (action == this.RESOLVE_ACTION_TERMINATE ||
                        action == this.RESOLVE_ACTION_SUSPEND)) ||
                (this.type == "User" && action == this.RESOLVE_ACTION_DELETE)
            );
        },
    },
};
</script>

<style scoped>
label {
    font-size: 1.2em;
    cursor: pointer;
    text-align: end;
}
</style>

<style>
@import url("../../styles/forms/form-overlay-styles.css");

.report-form-selection-container {
    width: 65%;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    align-items: center;
    justify-content: center;
}

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
