<template>
    <div class="event-container" v-for="(event, index) in events" :key="index">
        <div class="event-brief">
            <div class="event-header col-md-4">
                <span
                    class="date-box"
                    :style="{ backgroundColor: event.event_color }"
                >
                    <p class="month">
                        {{
                            new Date(event.event_date).toLocaleString("en-US", {
                                month: "short",
                            })
                        }}
                    </p>
                    <p class="day">
                        {{ new Date(event.event_date).getDate() }}
                    </p>
                </span>

                <div class="title-box">
                    <h1 class="event-name">{{ event.event_name }}</h1>
                    <p class="time">
                        {{
                            new Date(event.event_date).toLocaleTimeString([], {
                                timeStyle: "short",
                            })
                        }}
                    </p>
                </div>
            </div>

            <p class="event-desc">
                {{ event.event_desc }}
            </p>

            <div class="toggle-event-details">
                <span
                    class="material-symbols-outlined"
                    :title="`${showDetails ? 'Hide' : 'View'} event details`"
                    @click="() => toggleEventDetails(index)"
                >
                    {{
                        showDetails.includes(index)
                            ? "expand_less"
                            : "expand_more"
                    }}
                </span>
            </div>

            <div v-if="showPrivilegedActions" class="privilege-event-actions">
                <span
                    class="material-symbols-outlined"
                    title="Edit this event"
                    @click="() => editEvent(index)"
                    >edit</span
                >
                <span
                    class="material-symbols-outlined"
                    title="Delete this event"
                    @click="() => deleteEvent(index)"
                    >delete</span
                >
            </div>
        </div>

        <div v-if="showDetails.includes(index)" class="more-info">
            <img
                class="a-image col-md-5"
                :src="event.banner_link"
                alt="event banner"
            />
            <p class="location">Location: {{ event.event_location }}</p>
        </div>
    </div>
</template>

<script>
import { useConfirmStore } from "../../stores/ConfirmStore.js";
import { useAlertStore } from "../../stores/AlertStore.js";

export default {
    data() {
        return {
            events: [],
            showDetails: [],
        };
    },
    emits: ["edit-event", "show-loading"],
    computed: {
        showPrivilegedActions() {
            return location.pathname.startsWith("/admin/events");
        },
    },
    mounted() {
        this.getEvents();
    },
    methods: {
        // to toggle loading wheel
        toggleLoading(show) {
            this.$emit("show-loading", show);
        },
        // to toggle event details
        toggleEventDetails(index) {
            const existingIndex = this.showDetails.findIndex(
                (entry) => entry == index,
            );

            if (existingIndex != -1) {
                this.showDetails.splice(existingIndex, 1);
            } else {
                this.showDetails.push(index);
            }
        },
        // get events
        async getEvents() {
            await fetch(`${process.env.APP_SERVER_URL}/api/events`, {
                mode: "cors",
                method: "GET",
                credentials: "include",
            })
                .then(async (res) => {
                    if (res.ok) {
                        await res.json().then((data) => {
                            this.events = data.events;
                        });
                    } else {
                        throw new Error("Response not OK");
                    }
                })
                .catch(() => undefined);
        },
        // to edit events
        editEvent(index) {
            this.$emit("edit-event", this.events[index]);
        },
        // to delete events
        async deleteEvent(index) {
            const confirmDelete = await useConfirmStore().confirm(
                "Are you sure you want to delete this event?",
            );

            if (!confirmDelete) {
                return;
            }

            this.toggleLoading(true);

            // delete event
            await fetch(
                `${process.env.APP_SERVER_URL}/api/events/${
                    this.events[index]._id
                }`,
                {
                    method: "DELETE",
                    mode: "cors",
                    credentials: "include",
                },
            )
                .then(async (res) => {
                    await res.json().then(async (data) => {
                        await useAlertStore().alert(data.message);

                        if (res.ok) {
                            this.events.splice(index, 1);
                        }
                    });
                })
                .catch(() => undefined);

            this.toggleLoading(false);
        },
    },
};
</script>

<style>
@import url("../../styles/main.css");

.event-container {
    border-bottom: #133b5b 1px solid;
    padding: 10px 7%;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.event-brief {
    display: flex;
    flex-direction: row;
    column-gap: 30px;
    align-items: center;
}

.more-info {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: baseline;
}

.event-header {
    flex: 0 0 25%;
    display: flex;
    flex-direction: row;

    > * {
        display: flex;
        flex-direction: column;
        justify-content: center;

        > * {
            margin: 0;
        }
    }

    .title-box {
        margin: 0 auto;
        text-align: center;
    }
}

.event-name {
    font-size: 2em;
    color: var(--dark);
}

.event-desc {
    flex-grow: 1;
    padding: 30px;
    text-align: justify;
    word-wrap: break-word;
    white-space: pre-wrap;
    margin-bottom: 0;
}

.a-image {
    border-radius: 10px;
    height: 9rem;
    width: 35% !important;
    object-fit: cover;
    border: var(--dark) 1px solid;
    margin: 10px 0;
}

.location {
    font-weight: bold;
    font-size: large;
    color: #000;
    height: fit-content;
    margin-left: 15px;
}

.date-box {
    width: 100px;
    height: 100px;
    text-align: center;
    place-self: center;
    background-color: #133b5b;
}

.month {
    font-size: 25px;
    color: white;
    margin: 0;
}

.day {
    font-size: 20px;
    color: white;
    margin: 0;
}

.toggle-event-details {
    width: fit-content !important;

    .material-symbols-outlined {
        font-size: 50px !important;
    }
}

.privilege-event-actions {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    column-gap: 10px;
}
</style>

<style scoped>
.material-symbols-outlined {
    color: black;
    font-size: 2em;
}
</style>
