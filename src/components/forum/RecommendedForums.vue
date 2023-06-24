<template>
    <div class="card shadow">
        <div class="card-body">
            <h4 class="card-title">Recommendations</h4>

            <!-- max 6 groups -->
            <div class="group-container" @click="viewForum(forum)" v-for="forum in recommendations">
                <img class="groupPic" :src="forum.forum_pic_link" />
                <p class="text-below-pic">{{ forum.forum_name }}</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;
    float: left;
}

.text-below-pic:hover {
    color: var(--primary);
    cursor:pointer
}
.groupPic{
    float:left;
    width: 80px;
    height: 80px;
    margin-right: 20px;
    margin-top: 10px;
    margin-left: 25px;
    border-radius: 50%;
}
.groupPic:hover{
    cursor: pointer;
}
.text-below-pic {
    margin-top: 5px;
}
</style>
<script>
export default {
    data() {
        return {
            recommendations: {}
        }
    },
    mounted() {
        this.getRecommendations()
    },
    methods: {
        viewForum(forum) {
            sessionStorage.setItem('forum_id', forum._id)
            location.href = "/forumGroup.html"
        },
        
        async getRecommendations() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/forums/recommended`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Response not OK');
            })
            .then(data => {
                this.recommendations = data;
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        },
    }
}
</script>