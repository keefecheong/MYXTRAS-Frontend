<template>
    <div id="pet">
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
    width: 62.5px;
    height: 82.5px;
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;

} 
    @keyframes walk {
    0% {
        background-position: 0px;
        transform: translateX(0) scaleX(1);
    }
    49.999999999999% {
        background-position: 3000px;
        transform: translateX(1350px) scaleX(1);
    }
    50% {
        background-position: 3000px;
        transform: translateX(1350px) scaleX(-1);
    }
    100% {
        background-position: 0px;
        transform: translateX(0) scaleX(-1);
    }
}
</style>