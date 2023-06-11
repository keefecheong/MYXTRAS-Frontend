<template>

    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <h1>About Us</h1>

            <p>We are a group of Year 3 Cybersecurity students from Ngee Ann Polytechnic and this application is developed as
                part of our capstone project.</p>
            <p>We hope to encourage socialisation between students of different schools in Ngee Ann Polytechnic through this
                safe and secure environment.</p>
        </div>
    </div>

</template>

<script>
import NavSidebar from '../../components/general/NavSidebar.vue';

export default {
    components: {
        NavSidebar
    }
}
</script>