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
                        <a @click="viewForum(forum)"><img class="groupPic" :src="forum.forum_pic_link" :draggable="isDraggable"></a> 
                    </div>
                    <div class="col-md-8">
                        <p class="forum-name" @click="viewForum(forum)">{{ forum.forum_name }}</p>  
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
p:hover {
    color: var(--primary);
    cursor: pointer;
}
/* Track */
::-webkit-scrollbar-track {
background: #ffffff; 
border-radius: 15px;
}

/* Handle */
::-webkit-scrollbar-thumb {
background: #c9c9c9c4;
border-radius: 15px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
background: #c9c9c98d;
}
.card {
    padding: 1em 0 1em 0;
    border-radius: 15px;
    min-height: 50vh;
    max-height: 60vh;
}

.card-body {
    overflow-y: scroll;
}
.groupPic {
    overflow: hidden;
    float:left;
    width: 5vh;
    height: 5vh;
    margin-top: 15px;
    border-radius: 50%;
}
.groupPic:hover{
    cursor: pointer;
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
import viewForum from '../../utils/general/viewForum.js';

export default {
    data() {
        return {
            subbedForums: []
        }
    },
    created(){
        this.retrieveSubbedForums()
    },
    methods: {
        async retrieveSubbedForums() {            
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/subscribed`, {
                    method: "GET",
                    credentials: "include",
                    mode: 'cors'
                })
                .then(async response => {
                    if (response.ok) {
                        await response.json().then(data => {
                            this.subbedForums = data;
                        })
                    } else {
                        console.log('Error:', response);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        },

        viewForum(forum){
            viewForum(forum._id);
        },
    }
}
</script>
