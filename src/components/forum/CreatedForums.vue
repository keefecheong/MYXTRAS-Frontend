<template>
    <div v-if="createdForums.length !== 0">
        <div class="card shadow">
            <div class="card-body">
                <h5 class="card-title">Your Created Forums</h5>
                <div id="created-forum-container">
                    <div v-for="forum in createdForums" class="mini-forum-layout">
                        <img class="groupPic" :src="forum.forum_pic_link" @click="viewForum(forum)">
    
                        <span class="forum-name" @click="viewForum(forum)">{{ forum.forum_name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    
#created-forum-container {
    display: flex;
    flex-direction: column;
    position: relative;
    row-gap: 10px;
    align-items: start;
    width: fit-content;
    padding: 0 5vw;
    max-height: 30vh;
    margin: 0 auto;
    overflow-y: scroll;
}
.mini-forum-layout {
    margin: 5px;
}
.card {
    padding: 1em 0 1em 0;
    border-radius: 15px;
    margin-bottom: 60px;
    min-height: 50vh;
    max-height: 60vh;
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
@media screen and (max-width: 768px) {
#created-forum-container {
    display: flex;
    flex-direction: row;    
    overflow-x: scroll;
    max-width: 100%;
}
.card {
    padding: 1em 0 1em 0;
    border-radius: 15px;
    margin-bottom: 60px;
    min-height: 10vh;
}
.mini-forum-layout {
    margin: 5px;
    width: 30vw;
}
}
</style>

<script>
import viewForum from '../../utils/general/viewForum.js';

export default {
    data() {
        return {
            createdForums: []
        }
    },
    mounted() {
        this.retrieveCreatedForums()
    },
    methods: {
       
        viewForum(forum){
            viewForum(forum._id);
        },
    
        async retrieveCreatedForums() {
            
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/created`, {
                method: "GET",
                credentials: "include",
                mode: 'cors'
                })
                .then(async response => {
                if (response.ok) {
                    await response.json().then(data => {
                        this.createdForums = data
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
