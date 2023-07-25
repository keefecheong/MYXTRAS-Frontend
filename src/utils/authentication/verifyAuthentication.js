// check if user is authenticated
export default async function validateUser() {
    let authenticated = false;
    let is_profile_setup = false;
    let is_admin = false;

    await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
        method: 'get',
        credentials: 'include'
    }).then(async (res) => {
        if (res.status == 200) {
            await res.json().then(user => {
                authenticated = true;
                is_profile_setup = user.is_profile_setup;
                is_admin = user.is_admin;
            });
        }
        else {
            // if not authenticated clear local and session storage
            localStorage.clear();
            sessionStorage.clear();
        }
    }).catch((error) => {
        console.log(error);
    });

    return { authenticated, is_profile_setup, is_admin };
}