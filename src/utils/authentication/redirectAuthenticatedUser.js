// to redirect authenticated user back to home (feed.html) from login/registration etc. pages

import validateUser from "./verifyAuthentication.js";

export default async function redirectUser() {
    const result = await validateUser();

    // go to feed if user is authenticated and completed profile setup
    if (result.authenticated) {
        if (result.is_profile_setup) {
            location.href = '/feed.html';
        }
        else {
            location.href = '/setupProfile.html';
        }
    }
}