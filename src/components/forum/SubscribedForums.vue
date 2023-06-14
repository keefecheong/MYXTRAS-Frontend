<template>
    <div >
        <div class="card shadow">
            <div class="card-body card-position">
                <h5 class="card-title">Subscribed Forums</h5>
                <div class="row center-align" v-if="subbedForums.length === 0">
                    <p>No subscribed forums ☹</p>
                    <p>Head to the <a href="/explore.html">Xplore</a> page!</p>
                </div>
                <div v-for="forum in subbedForums" class="row">
                    <div class="col-md-4 d-flex justify-content-end">
                        <a href='./forumGroup.html'><img class="groupPic" :src="forum.banner_link" :draggable="isDraggable"></a> 
                    </div>
                    <div class="col-md-8">
                        <p class="forum-name">{{ forum.forumName }}</p>  
                    </div>
                </div>
                <h4><i class="bi bi-three-dots three-dots"></i></h4>
            </div>
        </div>
    </div>
</template>
<style scoped>
.center-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10vh;
}
</style>

<script>
export default {
    data() {
        return {
            subbedForums: []
            // forums: [
            // { name: 'ILUVCats', groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", description: 'We talk about cats' },
            // { name: 'muggingclub', groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", description: 'Gind never stops!' },
            // { name: 'muggingclub', groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", description: 'Gind never stops!' },
            // { name: 'muggingclub', groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", description: 'Gind never stops!' },
            // { name: 'muggingclub', groupPic: "https://www.vhv.rs/dpng/d/439-4393951_random-picture-of-a-person-hd-png-download.png", description: 'Gind never stops!' },
            // ],
        }
    },
    mounted(){
        this.test()
    },
    props: ['subbedForums'],
    methods: {
       
        test(){
            console.log(this.subbedForums)
        }
    
    }
}
</script>
