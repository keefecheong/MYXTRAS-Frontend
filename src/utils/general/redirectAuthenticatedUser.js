// to redirect authenticated user back to home (feed.html) from login/registration etc. pages

import validateUser from "./verifyAuthentication";

export default async function redirectUser() {
    const authenticated = await validateUser();

    if (authenticated) {
        location.href = '/feed.html';
    }
}