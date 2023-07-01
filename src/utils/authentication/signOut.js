// to log user out

export default async function signOut() {
    await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/cookie/remove`, {
        method: 'GET',
        mode: "cors",
        credentials: 'include'
    }).then(response => {
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    });
}