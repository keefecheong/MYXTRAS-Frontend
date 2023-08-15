<template>
    <div class="card shadow">
        <div class="card-body">
            <h4 class="card-title">Recommendations</h4>

            <!-- max 6 groups -->
            <div id="recommended-forum-container">
                <div
                    class="group-container"
                    @click="viewForum(forum)"
                    v-for="forum in recommendations"
                >
                    <img class="groupPic" :src="forum.forum_pic_link" />
                    <p class="recommended-forum-name hide-overflow-text">
                        {{ forum.forum_name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#recommended-forum-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 15px;
}

.group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.recommended-forum-name {
    padding: 2vh 2vw 0 2vw;
}
.recommended-forum-name:hover {
    color: var(--primary);
    cursor: pointer;
}

@media screen and (max-width: 768px) {
}
</style>

<script>
import viewForum from "../../utils/general/viewForum.js";

export default {
    data() {
        return {
            recommendations: {},
        };
    },
    mounted() {
        this.getRecommendations();
    },
    methods: {
        viewForum(forum) {
            viewForum(forum._id);
        },

        async getRecommendations() {
            await fetch(
                `${process.env.APP_SERVER_URL}/api/forums/recommended`,
                {
                    mode: "cors",
                    method: "GET",
                    credentials: "include",
                },
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("Response not OK");
                })
                .then((data) => {
                    this.recommendations = data;
                })
                .catch((error) => {
                    console.log("This page could not be loaded: ", error);
                });
        },
    },
};
</script>
