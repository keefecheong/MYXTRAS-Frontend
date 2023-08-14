<template>
    <div id="main-container">
        <NavSidebar />
        <div id="main-content" class="use-primary-secondary-gradient">

            <div id="about-content">
                <h1>About Us</h1>

                <hr />

                <p>
                    We are a group of Year 3 Cybersecurity students from Ngee Ann
                    Polytechnic and this application is developed as part of our
                    capstone project.
                </p>
                <p>
                    We hope to encourage socialisation between students of different
                    schools in Ngee Ann Polytechnic through this safe and secure
                    environment.
                </p>
            </div>
            <Pets />
        </div>
    </div>
</template>

<style>
@import url("../../styles/main.css");
</style>

<style scoped>
#main-content {
    text-align: center;
    color: white;
    position: relative;

    #about-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5em;
    }
}
</style>
