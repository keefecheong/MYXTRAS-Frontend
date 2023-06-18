<template>
    <div class="row a-all">
        <div class="a-container red">
            <h1 class="a-header">{{ announcements[0].title }}</h1>
            <p class="a-caption">
                {{ announcements[0].caption }}
            </p>
            <img class="a-image" :src="announcements[0].image" alt="forum-image">
        </div>
        <div class="a-container yellow">
            <h1 class="a-header">{{ announcements[1].title }}</h1>
            <p class="a-caption">
                {{ announcements[1].caption }}
            </p>
            <img class="a-image" :src="announcements[1].image" alt="forum-image">
        </div>
        <div class="a-container pink">
            <h1 class="a-header">{{ announcements[2].title }}</h1>
            <p class="a-caption">
                {{ announcements[2].caption }}
            </p>
            <img class="a-image" :src="announcements[2].image" alt="forum-image">
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
                    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/Ngee_Ann_Polytechnic_logo.svg",
                    color: "red"
                },
                {
                    title: "Halloween 👻",
                    caption: "As the crisp autumn air settles in and the leaves crunch underfoot, the time for spooky fun draws near. Halloween is just around the corner, and with it comes the thrill of the unknown and the excitement of dressing up in ghoulish costumes. So grab your broomsticks and don your masks, because it's time to embrace the spooky season and all the thrills that come with it! Let’s celebrate Halloween together at Ngee Ann Polytechnic! 🦇",
                    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/Ngee_Ann_Polytechnic_logo.svg",
                    color: "yellow"
                },
                {
                    title: "Halloween 👻",
                    caption: "As the crisp autumn air settles in and the leaves crunch underfoot, the time for spooky fun draws near. Halloween is just around the corner, and with it comes the thrill of the unknown and the excitement of dressing up in ghoulish costumes. So grab your broomsticks and don your masks, because it's time to embrace the spooky season and all the thrills that come with it! Let’s celebrate Halloween together at Ngee Ann Polytechnic! 🦇",
                    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/Ngee_Ann_Polytechnic_logo.svg",
                    color: "pink"
                }
            ],
            paused: false
        }
    },
    mounted() {
        this.autoScroll = () => {
            setInterval(() => document.querySelector('.a-all').scrollBy(2, 0), 50);
            if ((document.querySelector('.a-all').innerWidth + document.querySelector('.a-all').scrollX) >= document.body.offsetWidth) {
                // Reached end of page
                setInterval(() => document.querySelector('.a-all').scrollBy(-2, 0), 50);
                console.log("Reached end of page");
            }
        };
        this.autoScroll();
    },
    method: {
        stopScroll() {
            if (this.paused) {
                setInterval(document.getElementsByClassName('.a-all').scrollBy(0, 2), 50);
                paused = false;
            }
            else {
                clearInterval();
                paused = true;
            }
        }
    }
}
</script>

<style>
@import url('../../styles/main.css');

.a-container {
    display: inline-block;
    border: #133B5B;
    border-style: solid 1rem;
    margin: 50px 30px 30px 30px;
    margin-top: 50px;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);;
    border-radius: 10px;
    width: 40%;
    padding-bottom: 20px;
}

.a-header {
    font-size: 30px;
    font-weight: bold;
    border-bottom: #000000 2px solid;
    padding: 40px;
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
    width: 95%;
    height: 10rem;
    display: flex;
    margin: auto;
}

.a-all {
    overflow-x: auto;
    overflow-y: hidden;
    height: 85%;
    white-space: nowrap;
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