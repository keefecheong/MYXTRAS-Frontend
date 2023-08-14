<!--
    dynamic height textarea (grows to specified max number of rows and shrinks based on text entered)

    usage:
        props:
            modelValue: the variable passed through v-model
            placeholder: placeholder for the textarea
            maxRows: specify maximum number of rows before toggling to scroll mode (default 5)
            maxlength: specify maxlength for textarea
            border: specify css border (default none)
            padding: specify css padding (default 10px)  (or define css in parent styles)

    eg.
    <DynamicTextarea v-model="commentText" :maxRows="5" :placeholder="Enter comment" />
-->

<template>
    <textarea
        class="dynamic-textarea"
        v-model="parentText"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :id="workingID"
        @input="resizeTextarea"
    ></textarea>
</template>

<script>
import { v4 as uuid } from "uuid";

export default {
    data() {
        return {
            uuid: "a" + uuid(),
            singleLineHeight: null,
        };
    },
    props: [
        "modelValue",
        "placeholder",
        "border",
        "padding",
        "maxRows",
        "maxlength",
        "id",
    ],
    mounted() {
        const textarea = document.getElementById(this.workingID);

        // set border and padding if given as props
        if (this.border) {
            textarea.style.border = this.border;
        }

        if (this.padding) {
            textarea.style.padding = this.padding;
        }

        // get values to determine initial height
        const paddingTop = this.getIntDimension(textarea, "padding-top");
        const paddingBottom = this.getIntDimension(textarea, "padding-bottom");
        const borderWidthTop = this.getIntDimension(
            textarea,
            "border-top-width",
        );
        const borderWidthBottom = this.getIntDimension(
            textarea,
            "border-bottom-width",
        );
        const lineHeight = this.getIntDimension(textarea, "line-height");

        // sum of padding and border height
        const totalAdditionalHeight =
            paddingTop + paddingBottom + borderWidthTop + borderWidthBottom;

        // set initial height, minHeight and maxHeight
        this.singleLineHeight = `${totalAdditionalHeight + lineHeight}px`;

        textarea.style.minHeight = this.singleLineHeight;
        textarea.style.maxHeight = `${
            totalAdditionalHeight +
            lineHeight * ((this.maxRows ? this.maxRows : 5) - 1)
        }px`;

        textarea.style.height = this.singleLineHeight;
        textarea.style.height = `${textarea.scrollHeight}px`;
    },
    methods: {
        // dynamically resize textarea
        resizeTextarea() {
            const textarea = document.getElementById(this.workingID);
            textarea.style.height = this.singleLineHeight;
            textarea.style.height = `${textarea.scrollHeight}px`;
        },
        // get integer dimension of passed property
        getIntDimension(textarea, styleProperty) {
            return parseInt(
                window
                    .getComputedStyle(textarea)
                    [styleProperty].replace("px", ""),
            );
        },
    },
    computed: {
        // to update parent variable value when input changes
        parentText: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
        workingID() {
            return this.id ? this.id : this.uuid;
        },
    },
};
</script>

<style>
.dynamic-textarea {
    padding: 10px;
    width: 100%;
    resize: none;
    border: none;
    outline: none;
    box-sizing: border-box;
}
</style>
