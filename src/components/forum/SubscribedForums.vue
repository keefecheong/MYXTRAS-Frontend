<template>
    <div>
        <div class="card shadow">
            <div class="card-body card-position">
                <h5 class="card-title">Your Subscribed Forums</h5>
                <div class="row center-align" v-if="subbedForums.length === 0">
                    <p>No subscribed forums ☹</p>
                    <p>Head to the <a class="a-link" href="/explore.html">Xplore</a> page!</p>
                </div>

                <div v-else id="subscribed-forum-container">
                    <div
                        v-for="forum in subbedForums"
                        class="mini-forum-layout"
                    >
                        <img
                            class="groupPic"
                            :src="forum.forum_pic_link"
                            @click="viewForum(forum)"
                        />

                        <span class="forum-name" @click="viewForum(forum)">{{
                            forum.forum_name
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#subscribed-forum-container {
    display: flex;
    flex-direction: column;
    position: relative;
    row-gap: 10px;
    align-items: start;
    padding: 0 1vw;
    max-width: 15vw;
    max-height: 30vh;
    margin: 0 auto;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    word-wrap: break-word;
}
.mini-forum-layout {
    scroll-snap-align: center;
    word-wrap: break-word;
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
@media screen and (max-width: 768px) {
    .card {
        padding: 1em 0 1em 0;
        border-radius: 15px;
        margin-bottom: 60px;
        min-height: 10vh;
    }
    #subscribed-forum-container {
        display: flex;
        flex-direction: row;
        max-width: 100%;
        overflow-x: scroll;
    }
}
</style>

<script>
import viewForum from "../../utils/general/viewForum.js";

export default {
    data() {
        return {
            subbedForums: [],
        };
    },
    created() {
        this.retrieveSubbedForums();
    },
    methods: {
        async retrieveSubbedForums() {
            await fetch(
                `${process.env.APP_SERVER_URL}/api/forums/subscribed`,
                {
                    method: "GET",
                    credentials: "include",
                    mode: "cors",
                },
            )
                .then(async (response) => {
                    if (response.ok) {
                        await response.json().then((data) => {
                            this.subbedForums = data;
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },

        viewForum(forum) {
            viewForum(forum._id);
        },
    },
};
</script>
