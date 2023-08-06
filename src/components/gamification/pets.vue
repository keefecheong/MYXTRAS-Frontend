<template>
    <div id="pet" v-if="checkPage()">
        <div id="runner"></div>
    </div>
</template>

<style>
#pet{
    position: fixed;
    bottom: 0;
}

#runner{
    background: url("../../assets/panda_colour.png");
    width: 62.5px;                    /* divide one frame by 4 */
    height: 82.5px;                   /* divide one frame by 4 */
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;  /*divide the width adn height by 4*/

} 
    @keyframes walk {
    0% {
        background-position: 0px;
        transform: translateX(0) scaleX(1);
    }
    49.999999999999% {
        background-position: 3000px;
        transform: translateX(1320px) scaleX(1);
    }
    50% {
        background-position: 3000px;
        transform: translateX(1320px) scaleX(-1);
    }
    100% {
        background-position: 0px;
        transform: translateX(0) scaleX(-1);
    }
}

/* 
#runner{
    background: url("../../assets/chicken.png");
    width: 85px;
    height: 101px;
    /* animation: walk 10s steps(8) infinite; */
    /* background-size: 750px 88.5px; */
/* 
#runner{
    background: url("../../assets/scoobydoo.png");
    width: 1100px;
    height: 82.5px;
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;

} */

</style>

<script>
import { useWindowScroll } from '@vueuse/core';
import { getActivePinia } from 'pinia';

export default{
    props:[
        'enabled'
    ],
    data(){
        return{
            selectedChoice: null,
        }
    },
    created() {
        this.initData();
    },

    methods: {
        async initData(){
            // get user profile and follow status
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/gamification/gachapon`, {
                methods: 'GET',
                credentials: 'include',
                mode: 'cors'
            }).then(async (res) => {
                await res.json().then(data => {
                    this.selectedChoice = data.pets.enabled;
                });
            }).catch(error => {
                console.log(error);
            });
        },

        checkPage(){
            const currentPage = import.meta.env.VITE_BASE_URL + ":" + import.meta.env.VITE_PORT + '/gachapon.html'
            if(window.location.href == currentPage){
                return this.enabled;
            }
            return (this.enabled || this.selectedChoice);
        }
    }
}
</script>