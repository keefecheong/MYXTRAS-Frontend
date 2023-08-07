<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <h1 class="row pink-header">Xtra EVENTS! 🔊</h1>
            <AnnoucementLayout/>
            <Pets />
        </div>
    </div>

</template>

<script>
import AnnoucementLayout from '../../components/announcement/AnnoucementLayout.vue'; 

export default {
    components: {
        AnnoucementLayout
    },
    data() {
        return {
            scrolling: setInterval(() => document.querySelector('html').scrollBy(0, 1), 50),
        }
    },
    mounted() {
        this.autoScroll = () => {
            setInterval(this.checkScroll, 100)
        };
        this.autoScroll();
    },
    methods: {
        checkScroll() {
            const announceElement = document.querySelector('html');

            if (Math.ceil(announceElement.scrollTop + announceElement.clientHeight) >= announceElement.scrollHeight) {
                clearInterval(this.scrolling);
                // Reached end of page
                this.scrolling = setInterval(() => announceElement.scrollBy(0, -1), 50);
            }
            else if (Math.ceil(announceElement.scrollTop) == 0) {
                clearInterval(this.scrolling);
                // Reached start of page
                this.scrolling = setInterval(() => announceElement.scrollBy(0, 1), 50);
            }
        },
    }
}
</script>

<style>

.pink-header {
    margin: 0 -12px 0 -12px;
    padding-top: 3vh;
    padding-bottom: 3vh;
    background-color: var(--primary);
    color: white;
    justify-content: center;
}


</style>