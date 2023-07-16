<template>
    <div id="main-container">
        <NavSidebar/>
        <div id="main-content">
            <div id="header">
                <h1 id="title">Logs</h1>
            </div>

            <div id="logs_header" class="row">
                <div class="col-sm-2">
                    <p id="header_content">ID</p>
                </div> 
                <div class="col-sm-2">
                    <p id="header_content">Moderator</p>
                </div>      
                <div class="col-sm-2">
                    <p id="header_content">Time</p>
                </div>     
                <div class="col-sm-2">
                    <p id="header_content">Action</p>
                </div>     
                <div class="col-sm-2">
                    <p id="header_content">Details</p>
                </div>                
                <div class="col-sm-2">
                    <p></p>
                </div>      
            </div>


            <div id="logs_content" class="row">
                <div class="col-sm-2">
                    <p>1235</p>
                </div> 
                <div class="col-sm-2">
                    <p>AI</p>
                </div>      
                <div class="col-sm-2">
                    <p>12-1-23, 5:55PM</p>
                </div>     
                <div class="col-sm-2">
                    <span class="material-symbols-outlined delete" title="Blog Deletion">delete</span>
                    <p class="blogDeletion"> Blog Deletion</p>
                </div>     
                <div class="col-sm-2">
                    <p>Detected nudity content</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-2">
                    <p>1234</p>
                </div> 
                <div class="col-sm-2">
                    <p>AI</p>
                </div>      
                <div class="col-sm-2">
                    <p>12-1-23, 5:43PM</p>
                </div>     
                <div class="col-sm-2">
                    <span class="material-symbols-outlined censor" title="Censor">hide_source</span>
                    <p class="censorText"> Censor</p>
                </div>     
                <div class="col-sm-2">
                    <p>Detected racist comments in caption</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-2">
                    <p>1233</p>
                </div> 
                <div class="col-sm-2">
                    <p>Human</p>
                </div>      
                <div class="col-sm-2">
                    <p>12-1-23, 5:13PM</p>
                </div>     
                <div class="col-sm-2">
                    <span class="material-symbols-outlined delete" title="Blog Deletion">delete</span>
                    <p class="blogDeletion"> Blog Deletion</p>
                </div>     
                <div class="col-sm-2">
                    <p>Detected graphical content</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

            <hr>

            <div id="logs_content" class="row">
                <div class="col-sm-2">
                    <p>1232</p>
                </div> 
                <div class="col-sm-2">
                    <p>AI</p>
                </div>      
                <div class="col-sm-2">
                    <p>12-1-23, 5:05PM</p>
                </div>     
                <div class="col-sm-2">
                    <span class="material-symbols-outlined censor" title="Censor">hide_source</span>
                    <p class="censorText"> Censor</p>
                </div>     
                <div class="col-sm-2">
                    <p>Detected vulgarities in comment section</p>
                </div>                
                <div class="col-sm-2">
                    <button id="viewMoreButton">View more</button>
                </div>      
            </div>

        </div>
    </div>
</template>

<script>
import NavSidebar from '../../../components/admin/adminNavSidebar.vue';

export default {
    components: {
        NavSidebar,
    }
}
</script>

<style>
@import url('../../../styles/main.css');

#header{
    display: flex;
    flex-direction: row;
    background-color: #133B5B;
    padding: 50px 100px 50px 100px;
    min-height: 17vh;
    margin-left: -20px;
    justify-content: center;
}

#title{
    color: white;
    text-align: center;
}

#logs_header{
    display: flex;
    flex-direction: row;
    background-color: #EDEDED;
    padding: 50px 100px 50px 100px;
    height: 50px;;
    margin-left: -20px;
    justify-content: center;
}

#header_content{
    margin-bottom: 0px;
    font-weight: bold;
    margin-top: -12px;
}


#logs_content{
    display: flex;
    flex-direction: row;
    padding: 50px 100px 50px 100px;
    height: 50px;;
    margin-left: -20px;
    justify-content: center;
}

.delete{
    color: #FF0000;
    float: left;
}

.blogDeletion{
    color:#FF0000
}

.censor{
    color: #1C1B1F;
    float: left;
}

.censorText{
    color: #1C1B1F;
}

#viewMoreButton{
    color: #E53A73;
    border: 2px solid #E53A73;
    background-color: white;
    font-weight: bold;
    border-radius: 5px;
}

</style>

