<template>
    <div >
        <div class="card shadow">
            <div class="card-body card-position">
                <h5 class="card-title">Subscribed Forums</h5>
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

<style>
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;

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
