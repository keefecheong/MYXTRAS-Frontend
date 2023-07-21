<template>
    <div class="a-container row" v-for="announcement in announcements">
        <div class="col-md-4 left">
            <span :class="announcement.color + ' date-box'">
                <p class="month">May</p>
                <p class="day">31</p>
            </span>
            <div class="title-box">
                <h1 class="a-header">{{  announcement.title }}</h1>
                <p class="time">{{ announcement.time }}</p>
            </div>
            <br>
        </div>
        <p class="a-caption col-md-6">
            {{ announcement.caption }}
        </p>
        <div class="more-info">
            <img class="a-image col-md-5" :src="announcement.image" alt="announcement banner">
            <p class="location col-md-6">Location: {{ announcement.location }}</p>
        </div>
    </div>
</template>
<script>
export default { 
    data() {
        return {
            announcements: [
                {
                    title: "Halloween 👻",
                    caption: "As the crisp autumn air settles in and the leaves crunch underfoot, the time for spooky fun draws near. Halloween is just around the corner, and with it comes the thrill of the unknown and the excitement of dressing up in ghoulish costumes. So grab your broomsticks and don your masks, because it's time to embrace the spooky season and all the thrills that come with it! Let’s celebrate Halloween together at Ngee Ann Polytechnic! 🦇",
                    image: "https://img.freepik.com/free-vector/gradient-gaming-youtube-channel-art_23-2148878727.jpg?w=1380&t=st=1689929980~exp=1689930580~hmac=7c54fe004113f58ccd981b5f4f6ca5b61e3dcc16381c355e34920376c7c2b1ee",
                    color: "red",
                    date: "31 May 2021",
                    time: "8:00PM",
                    location: "Ngee Ann Polytechnic 1"
                },
                {
                    title: "NP Christmas Party!",
                    caption: "As the crisp autumn air settles in and the leaves crunch underfoot, the time for spooky fun draws near. Halloween is just around the corner, and with it comes the thrill of the unknown and the excitement of dressing up in ghoulish costumes. So grab your broomsticks and don your masks, because it's time to embrace the spooky season and all the thrills that come with it! Let’s celebrate Halloween together at Ngee Ann Polytechnic! 🦇",
                    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/Ngee_Ann_Polytechnic_logo.svg",
                    color: "yellow",
                    date: "31 May 2021",
                    time: "8:00PM",
                    location: "Ngee Ann Polytechnic 2"
                },
                {
                    title: "Graduation Ceremony",
                    caption: "As the crisp autumn air settles in and the leaves crunch underfoot, the time for spooky fun draws near. Halloween is just around the corner, and with it comes the thrill of the unknown and the excitement of dressing up in ghoulish costumes. So grab your broomsticks and don your masks, because it's time to embrace the spooky season and all the thrills that come with it! Let’s celebrate Halloween together at Ngee Ann Polytechnic! 🦇",
                    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/Ngee_Ann_Polytechnic_logo.svg",
                    color: "pink",
                    date: "31 May 2021",
                    time: "8:00PM",
                    location: "Ngee Ann Polytechnic 3"
                }
            ],
            scrolling: setInterval(() => document.querySelector('.announce').scrollBy(1, 0), 50)
        }
    },
    mounted() {
        this.autoScroll = () => {
            setInterval(this.checkScroll, 100)
        };
        this.autoScroll();
    },
    methods: {
        checkScroll() {
            const announceElement = document.querySelector('.announce');

            if (Math.ceil(announceElement.scrollLeft + announceElement.clientWidth) >= announceElement.scrollWidth) {
                clearInterval(this.scrolling);
                // Reached end of page
                this.scrolling = setInterval(() => announceElement.scrollBy(-1, 0), 50);
            }
            else if (Math.ceil(announceElement.scrollLeft) == 0) {
                clearInterval(this.scrolling);
                // Reached start of page
                this.scrolling = setInterval(() => announceElement.scrollBy(1, 0), 50);
            }
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

.a-container {
    display: flex;
    border-bottom: #133B5B 1px solid;
}

.more-info {
    display: flex;
}

.left {
    display: flex;
    margin-left: 7%;
}

.a-header {
    font-size: 30px;
    font-weight: bold;
    color: var(--dark);
}

.a-caption {
    font-size: 15px;
    padding: 30px;
    text-align: justify;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.a-image {
    border-radius: 10px;
    height: 9rem;
    width: 40% !important;
    object-fit: cover;
    border: var(--dark) 1px solid;
    padding: 0 !important;
    margin: 10px;
}

.location {
    font-style: bold !important;
    bottom: 0 !important;
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
    margin-left: 10%;
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