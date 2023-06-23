<template>
    <div v-if="createdForums.length !== 0">
        <div class="card shadow">
            <div class="card-body card-position">
                <h5 class="card-title">Created Forums</h5>
                <div v-for="forum in createdForums" class="row">
                    <div class="col-md-4 d-flex justify-content-end">
                        <img class="groupPic" :src="forum.forum_pic_link" :draggable="isDraggable" @click="viewForum(forum)">
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
.card {
    padding: 1em 0 1em 0;
    border: none !important;
    border-radius: 10px;
    margin: 3vh 1vh;
    min-height: 50vh;
    max-height: 60vh;
    overflow-y: scroll;
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
p:hover {
    color: var(--primary);
    cursor: pointer;
}
</style>

<script>
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
            sessionStorage.setItem('forum_id', forum._id);
            location.href = "/forumGroup.html"
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
