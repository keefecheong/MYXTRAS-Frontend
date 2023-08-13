// to log user out

export default async function signOut() {
    let success = false;

    await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/remove`,
        {
            method: "GET",
            mode: "cors",
            credentials: "include",
        },
    ).then((response) => {
        if (response.ok) {
            success = true;

            // clear data in local and session storage when signed out
            localStorage.clear();
            sessionStorage.clear();
        }
    });

    return success;
}
