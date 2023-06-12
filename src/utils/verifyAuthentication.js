// check if user is authenticated
export default async function validateUser() {
    let authenticated = false;

    await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
        method: 'get',
        credentials: 'include'
    }).then((res) => {
        console.log(res);
        console.log(res.status);
        if (res.status == 200) {
            authenticated = true;
        }
    }).catch((error) => {
        console.log(error);
    });

    return authenticated;
}