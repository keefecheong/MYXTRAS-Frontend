// to redirect authenticated user back to home (feed.html) from login/registration etc. pages

import validateUser from "./verifyAuthentication.js";

export default async function redirectUser() {
    const result = await validateUser();

    // if authenticated,
    if (result.authenticated) {
        // if profile not setup then go to setupProfile.html
        if (!result.is_profile_setup) {
            location.href = '/setupProfile.html';
        }
        // otherwise go to feed.html
        else {
            location.href = '/feed.html';
        }
    }
}