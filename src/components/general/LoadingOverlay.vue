<!-- 
    loading animation (simple spinning wheel)

    usage: import and use as normal component

    props (all optional): 
        backgroundColor: defines background color of loader container (useful for blurring background to create overlay effect)
        loaderSize: defines width and height of loader
        loaderBorderWidth: defines border width of loader (width of wheel)
        horizontalCenter: horizontally center the loader (recommended if container width is larger than wheel)
        verticalCenter: vertically center the loader (recommended if container height is larger than wheel)
        center: sets both verticalCenter and horizontalCenter to true

    eg. 
    <LoadingOverlay :backgroundColor="'rgba(0, 0, 0, 0.5)'" :loaderSize="'20px'" :loaderBorderWidth="'5px'" :horizontalCenter="true" :verticalCenter="true" />
 -->

<template>
    <div class="loader-overlay" :style="`background-color: ${backgroundColor};`">
        <div class="loader-container" :class="{'horizontal-center': horizontalCenter || center, 'vertical-center': verticalCenter || center}">
            <div class="loader" :style="`width: ${loaderSize}; height: ${loaderSize}; border-width: ${loaderBorderWidth};`"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'loaderSize',
        'loaderBorderWidth',
        'backgroundColor',
        'horizontalCenter',
        'verticalCenter',
        'center'
    ]
}
</script>

<style>
@import url('../../styles/main.css');

.loader-overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 999;
}

.loader-container {
    height: fit-content;
    width: fit-content;
    position: absolute;
    top: 0;
    left: 0;
}

.loader-container.horizontal-center {
    left: 50%;
    transform: translateX(-50%);
}

.loader-container.vertical-center {
    top: 50%;
    transform: translateY(-50%);
}

.loader {
    border: 5px solid lightgray;
    border-top: 5px solid var(--primary);
    border-radius: 50%;
    width: 2em;
    height: 2em;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>