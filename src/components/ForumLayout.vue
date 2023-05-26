<template>
    <div class="forum-container">
        <div class="row">
            <div class="col-1">
                <img class="profilepic" src="https://i.imgur.com/1qkYzYH.jpg" alt="profilepic">
            </div>
            <div class="col-10">
                <p><a href="#" class="forum-name">x/modana</a> ~ Posted by: <a href="#" class="username">@UIFAN</a></p>
                <div class="row"><Button></Button></div>            
                <h3 class="forum-title">What is the best way to get rid of acne?</h3>
                <p class="forum-caption">
                    shdkajhsdkjhaksjdhkjashdkjahsdkjasdhkja
                    shdkajhsdkjhaksjdhkjashdkjahsdkjasdhkja
                    shdkajhsdkjhaksjdhkjashdkjahsdkjasdhkjashdkajhsdkjhaksjdhkjashdkjahsdkjasdhkjashdkajhsdkjhaksjdhkjashdkjahsdkjasdhkja
                </p>
                <img class="forum-image" src="https://i.imgur.com/1qkYzYH.jpg" alt="forum-image">
            </div>
        </div>
    </div>
</template>

<style>
@import url('../styles/main.css');
.forum-container {
    border: #133B5B;
    border-style: solid 1rem;
    margin: auto;
    box-shadow: 1px 1px 5px 1px rgba(65, 48, 48, 0.3);;
    border-radius: 10px;
    padding: 40px;
}

.profilepic {
    display: grid;
    place-self: center;
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.col-1 {
    margin-right: 30px;
}

.forum-name {
    font-size: 15px;
    font-weight: bold;
    color: #133B5B;
}

.forum-caption {
    text-align: justify;
    word-wrap: break-word;
}

.forum-image {
    border-radius: 10px;
    max-width: 100%;
    max-height: 500px;
    display: flex;
    margin: auto;
}

#interest-badge{
    margin: 5px;
    padding: 10px;
}

.badge-kpop {
    background-color: #FF7BE2;
}

.badge-games {
    background-color: #6FE5FF;
}

.badge-technology {
    background-color: #6FFFA8;
}

.badge-sports{
    background-color: #FFE27B;
}

.badge-dancing{
    background-color: #7B88FF;
}

.badge-jpop{
    background-color: #FFAB6F;
}

.badge-coding{
    background-color: #6F74FF;
}

.badge-lifestyle{
    background-color: #FC5454;
}
</style>
<script>
import { Button } from 'bootstrap';


</script>