<template>
    <h1>Create New Post</h1>

    <form @submit.prevent="submitForm">
        <input type="file" id="uploadImages" multiple />
        <br/>
        <input type="reset" value="Clear" />
        <input type="submit" value="Create!" />
    </form>
</template>

<script>
export default {
    methods: {
        async submitForm(e) {
            // check if the user has uploaded any files
            if (e.target.uploadImages.files.length <= 0) {
                return;
            }

            var formData = new FormData();

            // add images to formData
            for (let i = 0; i < e.target.uploadImages.files.length; i++) {
                formData.append('selectedImages', e.target.uploadImages.files[i]);
            }

            // TODO implement account management to get user id
            // add creator_id (current user's id) to formData
            formData.append('creator_id', '6021fde84705d830b8e458ab');

            // send request to backend server with data
            await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/posts`, {
                mode: 'cors',
                method: 'POST',
                body: formData
            }).then((res) => {
                e.target.reset();

                res.json().then((data) => {
                    alert(data.message);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style>

</style>