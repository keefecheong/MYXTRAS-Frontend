<!-- admin version of banner (searchbar for users) -->
<template>
    <div id="admin-banner-container" class="banner-container">
        <slot name="header"><h1>Header</h1></slot>
        <div id="admin-banner-right-content"><slot name="right-content"></slot></div>
    </div>
</template>

<style>
@import url('../../styles/banner-styles.css');

#admin-banner-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: clamp(60px, 10dvh, 90px);
    background-color: var(--dark);

    > h1 {
        width: 50%;
        color: white;
        position: relative;
        left: 50%;
        white-space: nowrap;
        transform: translateX(-50%);
        text-decoration: underline;
        text-underline-offset: 10px;
        text-decoration-thickness: 2px;
    }

    > h1::before {
        content: 'xx';
        color: var(--dark);
        position: relative;
        right: -1px;
    }

    > h1::after {
        content: 'xx';
        color: var(--dark);
        position: relative;
        left: -1px;
    }
}

#admin-banner-right-content {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding-right: 2%;
    z-index: 1;
}
</style>