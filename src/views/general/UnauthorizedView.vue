<template>
    <div id="unauthorized-container">
        <h1>401 Unauthorized</h1>
        <p>You do not have access to this page.</p>
        <a href="/login.html">Login</a>
    </div>
</template>

<style scoped>
#unauthorized-container {
    height: 100dvh;
    width: 100dvw;
    padding-top: 20dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 30px;
}

h1 {
    font-size: 3em;
}

a {
    color: var(--dark) !important;
    text-decoration: underline !important;
    font-style: italic;
}

a:hover {
    opacity: 0.7;
}

* {
    color: red;
    font-size: larger;
}
</style>