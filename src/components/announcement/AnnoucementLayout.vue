<template>
    <div class="a-container row" v-for="(event, index) in events">
        <div class="col-md-4 left">
            <span class="date-box" :style="{ backgroundColor: event.event_color }">
                <p class="month">{{ new Date(event.event_date).toLocaleString('en-US', { month: 'short' }) }}</p>
                <p class="day">{{ new Date(event.event_date).getDate() }}</p>
            </span>
            <div class="title-box">
                <h1 class="a-header">{{  event.event_name }}</h1>
                <p class="time">{{ new Date(event.event_date).toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'}) }}</p>
            </div>
            <br>
        </div>
        <p class="a-caption col-md-6">
            {{ event.event_desc }}
        </p>
        <div class="col-md-1 expand">
            <span class="triangle-down" :id="`triangle-${index}`" @click="toggleMore(index)"></span>
        </div>
        <div class="more-info" :id="`more-${index}`">
            <img class="a-image col-md-5" :src="event.banner_link" alt="event banner">
            <p class="location col-md-6">Location: {{ event.event_location }}</p>
        </div>
    </div>
</template>
<script>
export default { 
    data() {
        return {
            events: [],
            index: 0
        }
    },
    mounted() {
        this.autoScroll = () => {
            setInterval(this.checkScroll, 100)
        };
        this.autoScroll();
        this.getEvents();
    },
    methods: {
        toggleMore(indexValue) {
            const status = document.getElementById(`triangle-${indexValue}`).className;
            
            if (status == "triangle-down") {
                document.getElementById(`triangle-${indexValue}`).className = "triangle-up";
                document.getElementById(`more-${indexValue}`).className = "more-info show";
            } else {
                document.getElementById(`triangle-${indexValue}`).className = "triangle-down";
                document.getElementById(`more-${indexValue}`).className = "more-info";
            }
        },
        async getEvents() {
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/events`, {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Response not OK');
            })
            .then(data => {
                this.events = data.events;
            })
            .catch((error) => {
                console.log("This page could not be loaded: ", error);
            });
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

.a-container {
    border-bottom: #133B5B 1px solid;
    padding-bottom: 10px;
    padding-top: 10px;
}

.more-info {
    display: none;
    position: relative;
}

.left {
    display: flex;
    margin-left: 7%;
}

.a-header {
    font-size: 30px;
    color: var(--dark);
}

.a-caption {
    font-size: 15px;
    padding: 30px;
    padding-left: 50px !important;
    text-align: justify;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.a-image {
    border-radius: 10px;
    height: 9rem;
    width: 35% !important;
    object-fit: cover;
    border: var(--dark) 1px solid;
    margin: 10px;
    margin-left: 7%;
}

.location {
    position: absolute;
    font-weight: bold;
    font-size: large;
    color: #000;
    bottom: 0;
    right: 6%;
    height: fit-content;
}

.date-box {
    width: 100px;
    height: 100px;
    text-align: center;
    place-self: center;
    background-color: #133B5B;
    padding-top: 1rem;
}

.title-box {
    text-align: center;
    place-self: center;
    
    margin-left: auto;
    margin-right: auto;
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


.triangle-up {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid #000;
    cursor: pointer;
}

.triangle-down {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid #000;
    cursor: pointer;
}

.expand {
    text-align: center;
    place-self: center;
}

.show {
    display: flex !important;
}

.pink {
    background-color: #FF7BE2;
}

.blue {
    background-color: #6FE5FF;
}

.green {
    background-color: #6FFFA8;
}

.yellow {
    background-color: #FFE27B;
}

.dark-blue {
    background-color: #7B88FF;
}

.orange {
    background-color: #FFAB6F;
}

.red {
    background-color: #FC5454;
}
</style>