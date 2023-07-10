// check if user is authenticated
export default async function validateUser() {
    let result = {
        authenticated: false,
        is_profile_setup: false
    }

    await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/verify`, {
        method: 'get',
        credentials: 'include'
    }).then(async (res) => {
        if (res.status == 200) {
            await res.json().then(user => {
                result.authenticated = true;
                result.is_profile_setup = user.is_profile_setup;
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

    return result;
}