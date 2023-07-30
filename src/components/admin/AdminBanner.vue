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
    flex-wrap: wrap;
    flex-direction: column;
    background-color: var(--dark);
    padding: 10px 0;
    row-gap: 10px;

    > h1 {
        color: white;
        white-space: nowrap;
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
</style>