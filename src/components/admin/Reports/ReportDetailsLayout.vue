<!-- layout for report details -->

<template>
    <LoadingOverlay v-if="showLoading" :backgroundColor="'rgba(0, 0, 0, 0.5)'" :center="true" />

    <div class="detailed-layout-container">
        <div class="detailed-layout-side-container close">
            <span class="material-symbols-outlined" title="Back" @click="() => closeDetails(false)">arrow_back</span>
        </div>

        <div class="detailed-layout-content-container">
            <h1>Report Details</h1>

            <div>
                <div>
                    <span>Object Type:</span>
                    <span>{{ report.report_target_type }}</span>
                </div>

                <div v-if="admin">
                    <span>Object ID:</span>
                    <span>{{ aggregated ? report._id : report.report_target }}</span>
                </div>

                <div v-if="aggregated">
                    <span>No. of Reports:</span>
                    <span>{{ report.count }}</span>
                </div>
                
                <div>
                    <span>Report Time:</span>
                    <span>{{ getTimeForDisplay(report.report_time) }}</span>
                </div>
            </div>
            
            <div>
                <div>
                    <span>Object Owner Username:</span>
                    <span>{{ report.report_target_owner.username }}</span>
                </div>
    
                <div v-if="admin">
                    <span>Object Owner ID:</span>
                    <span class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(report.report_target_owner._id)">{{ report.report_target_owner._id }}</span>
                </div>
            </div>

            <div v-if="reportParent?.type && reportParent?.id">
                <div>
                    <span>Parent Type:</span>
                    <span>{{ reportParent.type }}</span>
                </div>
    
                <div>
                    <span>Parent ID:</span>
                    <span>{{ reportParent.id }}</span>
                </div>
            </div>

            <div>
                <div v-if="aggregated">
                    <span>Reporter(s):</span>
                    <span>{{ report.reporter.subject.join(', ') }}</span>
                </div>

                <div>
                    <span>Report Reason(s):</span>

                    <ul v-if="aggregated">
                        <li v-for="reason in report.report_reasons">{{ reason }}</li>
                    </ul>

                    <span v-else>{{ report.report_reason }}</span>
                </div>

                <div v-if="report.report_reasons?.includes('Other') || report.report_reason == 'Other'">
                    <span>Supporting Description(s):</span>

                    <ul v-if="aggregated">
                        <li v-for="reason in report.report_other_reasons">{{ reason }}</li>
                    </ul>

                    <span v-else>{{ report.report_other_reason }}</span>
                </div>
    
                <div v-if="report.report_target_type == REPORT_TARGET_TYPE_USER && report.report_evidence">
                    <span>Report Evidence:</span>
                    <a :href="report.report_evidence" target="_blank">
                        <img :src="report.report_evidence" alt="Report Evidence" title="Click to view image" />
                    </a>
                </div>
            </div>

            <div>
                <div v-if="reviewed && admin">
                    <span>Reviewer Username:</span>
                    <span>{{ report.reviewer_id.username }}</span>
                </div>
    
                <div v-if="reviewed && admin">
                    <span>Reviewer ID:</span>
                    <span class="details-layout-profile-link" title="Click to view user" @click="() => viewUser(report.reviewer_id._id)">{{ report.reviewer_id._id }}</span>
                </div>
    
                <div v-if="reviewed">
                    <span>Review Time:</span>
                    <span>{{ getTimeForDisplay(report.review_time) }}</span>
                </div>
                
                <div>
                    <span>Status:</span>
                    <span>{{ report.status }}</span>
                </div>

                <div v-if="report.status == 'Success'">
                    <span>Reason:</span>
                    <span>{{ report.review_reason }}</span>
                </div>
            </div>

            <button class="use-primary-secondary-gradient details-button detailed-layout-view-button" v-if="!reviewed" @click="viewContent" :title="viewTitle">{{ viewTitle }}</button>
            

            <div id="detailed-report-view-messages-container" v-if="viewMessages">
                <ChatMessageLayout 
                    v-for="(message, index) in messages" 
                    :message="message" 
                    :previous_creation_time="previousCreationTime(index)" 
                    :previous_is_sender="previousIsSender(index)"
                    :name="report.report_target_owner.username"
                    :blocked="true"
                    :key="index"
                />
            </div>
        </div>

        <div class="detailed-layout-side-container right">
            <button class="use-primary-secondary-gradient details-button" v-if="!reviewed && admin" @click="() => toggleReportForm(true)" title="Resolve report">Resolve</button>
        </div>
    </div>

    <ReportFormLayout
        v-if="showReportForm"
        :type="resolveReportType"
        :userId="resolveUserId"
        :postId="resolvePostId"
        :forumId="resolveForumId"
        :threadId="resolveThreadId"
        :commentId="resolveCommentId"
        :messageId="resolveMessageId"
        :resolve="true"
        @close-report-form="handleCloseReportForm"
    />
</template>

<script>
import ReportFormLayout from '../../report/ReportFormLayout.vue';
import LoadingOverlay from '../../general/LoadingOverlay.vue';
import ChatMessageLayout from '../../chat/ChatMessageLayout.vue';
import viewUser from '../../../utils/general/viewUser.js';
import viewForum from '../../../utils/general/viewForum.js';
import highlightElement from '../../../utils/general/highlightElement.js';
import getFormattedTime from '../../../utils/general/getFormattedTime.js';

export default {
    data() {
        return {
            showReportForm: false,
            showLoading: false,
            messages: [],
            viewMessages: false,
            REPORT_TARGET_TYPE_USER: 'User',
            REPORT_TARGET_TYPE_POST: 'Post',
            REPORT_TARGET_TYPE_FORUM: 'Forum',
            REPORT_TARGET_TYPE_THREAD: 'Thread',
            REPORT_TARGET_TYPE_COMMENT: 'Comment',
            REPORT_TARGET_TYPE_POST_COMMENT: 'postComment',
            REPORT_TARGET_TYPE_THREAD_COMMENT: 'threadComment',
            REPORT_TARGET_TYPE_MESSAGE: 'Message'
        }
    },
    components: {
        ReportFormLayout,
        LoadingOverlay,
        ChatMessageLayout
    },
    props: [
        'report',
        'aggregated',
        'admin'
    ],
    emits: [
        'close-report-details'
    ],
    mounted() {
        window.scrollTo(0, 0);
    },
    computed: {
        // check if report is reviewed
        reviewed() {
            return this.report.status != 'Submitted';
        },
        // generate title/display text for view reported object button
        viewTitle() {
            return this.report.report_target_type == this.REPORT_TARGET_TYPE_USER ? 'View User' : 'View Content'
        },
        // get parent type and id for reported object
        reportParent() {
            switch (this.report.report_target_type) {
                case this.REPORT_TARGET_TYPE_COMMENT:
                    return { type: this.report.meta.comment_parent_type, id: this.report.meta.post_id || this.report.meta.thread_id };

                case this.REPORT_TARGET_TYPE_THREAD:
                    return { type: 'Forum', id: this.report.meta.forum_id };

                case this.REPORT_TARGET_TYPE_MESSAGE:
                    return { type: 'Chat', id: this.report.meta.chat_id};
            }

            return null;
        },
        // get type of report to resolve
        resolveReportType() {
            if (this.report.report_target_type != this.REPORT_TARGET_TYPE_COMMENT) return this.report.report_target_type;

            return this.report.meta.comment_parent_type == this.REPORT_TARGET_TYPE_POST ? this.REPORT_TARGET_TYPE_POST_COMMENT : this.REPORT_TARGET_TYPE_THREAD_COMMENT;
        },
        // get userId to pass to reportFormLayout
        resolveUserId() {
            if (![this.REPORT_TARGET_TYPE_USER, this.REPORT_TARGET_TYPE_POST, this.REPORT_TARGET_TYPE_POST_COMMENT].includes(this.resolveReportType)) return null;

            return this.report.meta?.creator_id || this.report.report_target;
        },
        // get postId to pass to reportFormLayout
        resolvePostId() {
            if (![this.REPORT_TARGET_TYPE_POST, this.REPORT_TARGET_TYPE_POST_COMMENT].includes(this.resolveReportType)) return null;
            
            return this.report.meta?.post_id || this.report.report_target;
        },
        // get forumId to pass to reportFormLayout
        resolveForumId() {
            if (![this.REPORT_TARGET_TYPE_FORUM, this.REPORT_TARGET_TYPE_THREAD, this.REPORT_TARGET_TYPE_THREAD_COMMENT].includes(this.resolveReportType)) return null;

            return this.report.meta?.forum_id || this.report.report_target;
        },
        // get threadId to pass to reportFormLayout
        resolveThreadId() {
            if (![this.REPORT_TARGET_TYPE_THREAD, this.REPORT_TARGET_TYPE_THREAD_COMMENT].includes(this.resolveReportType)) return null;

            return this.report.meta?.thread_id || this.report.report_target;
        },
        // get commentId to pass to reportFormLayout
        resolveCommentId() {
            return this.report.report_target_type == this.REPORT_TARGET_TYPE_COMMENT ? this.report.report_target : null;
        },
        // get messageId to pass to reportFormLayout
        resolveMessageId() {
            return this.report.report_target_type == this.REPORT_TARGET_TYPE_MESSAGE ? this.report.report_target : null;
        }
    },
    methods: {
        // close report details view
        closeDetails(resolved, resolveDetails) {
            this.$emit('close-report-details', resolved, resolveDetails);
        },
        // get time for display
        getTimeForDisplay(timeString) {
            return getFormattedTime(timeString);
        },
        // open form to resolve report
        toggleReportForm(show) {
            this.showReportForm = show;
        },
        // close form for resolving report and close details if report is resolved
        handleCloseReportForm(submitted, resolveDetails) {
            this.toggleReportForm(false);

            if (submitted) {
                this.closeDetails(true, resolveDetails);
            }
        },
        // to view user
        viewUser(userId) {
            viewUser(userId, true);
        },
        // to view content
        async viewContent() {
            switch (this.resolveReportType) {
                // if report is for a user then go to the user's profile page
                case this.REPORT_TARGET_TYPE_USER:
                    viewUser(this.report.report_target, true);
                    break;
                
                // if report is for a post then go to the post creator's profile page and scroll to post
                case this.REPORT_TARGET_TYPE_POST:
                    viewUser(this.report.meta.creator_id, true, this.report.report_target);
                    break;

                // if report is for a comment under a post go to the post creator's profile page and scroll to comment
                case this.REPORT_TARGET_TYPE_POST_COMMENT:
                    viewUser(this.report.meta.creator_id, true, this.report.meta.post_id, this.report.report_target);
                    break;

                // if report is for a forum go to the forumGroup page
                case this.REPORT_TARGET_TYPE_FORUM:
                    viewForum(this.report.report_target, true);
                    break;

                // if report is for a thread go to the forumGroup page for the parent forum and open details for thread
                case this.REPORT_TARGET_TYPE_THREAD:
                    viewForum(this.report.meta.forum_id, true, this.report.report_target);
                    break;

                // if report is for a comment under a thread go the forumGroup page for the parent forum and open details for thread, then scroll to comment
                case this.REPORT_TARGET_TYPE_THREAD_COMMENT:
                    viewForum(this.report.meta.forum_id, true, this.report.meta.thread_id, this.report.report_target);
                    break;

                // if report is for a message then get extra messages for more context
                case this.REPORT_TARGET_TYPE_MESSAGE:
                    if (this.messages.length <= 0) {
                        this.showLoading = true;
    
                        await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/admin/report/user/${this.report.reporter.id?._id || this.report.reporter.id}/messages/${this.report.report_target}`, {
                            mode: 'cors',
                            method: 'GET',
                            credentials: 'include'
                        }).then(async res => {
                            await res.json().then(data => {
                                this.messages = data;
                                this.showLoading = false;
                            });
                        }).catch(error => console.log('Could not retrieve messages'));
                    }
                    
                    this.viewMessages = true;

                    setTimeout(() => {
                        const chatbox = document.getElementById('detailed-report-view-messages-container');

                        if (chatbox) {
                            chatbox.scrollIntoView({
                                block: 'start'
                            });

                            highlightElement(chatbox);
                        }
                    }, 300);

                    break;

                default:
                    break;
            }
        },
        // get creation_time of previous message or '' if it is the first message
        previousCreationTime(index) {
            return index == 0 ? '' : this.messages[index - 1].creation_time;
        },
        // get is_sender of previous message or null if it is the first message
        previousIsSender(index) {
            return index == 0 ? null : this.messages[index - 1].is_sender;
        }
    }
}
</script>

<style>
#detailed-report-view-messages-container {
    width: 90%;
    margin: 50px auto;
    padding: 20px 0;
    border: 2px solid black;
    border-radius: 15px;
    transition: background-color 1s ease-out;
}
</style>