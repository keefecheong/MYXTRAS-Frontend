<template>
    <div class="a-container row" v-for="(announcement, index) in announcements">
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
        <div class="col-md-1 expand">
            <span class="triangle-down" :id="`triangle-${index}`" @click="toggleMore(index)"></span>
        </div>
        <div class="more-info" :id="`more-${index}`">
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
            scrolling: setInterval(() => document.querySelector('html').scrollBy(0, 1), 50),
            index: 0
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
            const announceElement = document.querySelector('html');

            if (Math.ceil(announceElement.scrollTop + announceElement.clientHeight) >= announceElement.scrollHeight) {
                clearInterval(this.scrolling);
                // Reached end of page
                this.scrolling = setInterval(() => announceElement.scrollBy(0, -1), 50);
            }
            else if (Math.ceil(announceElement.scrollTop) == 0) {
                clearInterval(this.scrolling);
                // Reached start of page
                this.scrolling = setInterval(() => announceElement.scrollBy(0, 1), 50);
            }
        },
        toggleMore(indexValue) {
            const status = document.getElementById(`triangle-${indexValue}`).className;
            
            if (status == "triangle-down") {
                document.getElementById(`triangle-${indexValue}`).className = "triangle-up";
                document.getElementById(`more-${indexValue}`).className = "more-info show";
            } else {
                document.getElementById(`triangle-${indexValue}`).className = "triangle-down";
                document.getElementById(`more-${indexValue}`).className = "more-info";
            }
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

.a-container {
    border-bottom: #133B5B 1px solid;
    padding-bottom: 10px;
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
    width: 40% !important;
    object-fit: cover;
    border: var(--dark) 1px solid;
    margin: 10px;
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