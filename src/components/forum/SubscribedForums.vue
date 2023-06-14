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
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
    min-height: 50vh;
    max-height: 100vh;
    overflow: hidden;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;
}
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
        }
    },
    mounted(){
        this.retrieveSubbedForums()
    },
    methods: {
       
        
        async retrieveSubbedForums() {
            
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/get-subbed-forums/`, {
                method: "GET",
                credentials: "include"
                })
                .then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        this.subbedForums = data
                    })
                } else {
                    console.log('Error:', response);
                }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },
    
    }
}
</script>
