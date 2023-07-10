// to implement access control
// render original page if user is authenticated,
// unauthorized page otherwise (contains link to login page)

// general usage:
// import App from './<name>.vue';
// import dynamicMount from '../path/authAccessControl.js';

// const app = await dynamicMount();
// app.mount('#app');

// if other libraries need to be used (eg. router):
// app.use(router).mount('#app');

import { createApp } from 'vue';
import validateUser from './verifyAuthentication.js';
import UnauthorizedView from '../../views/general/UnauthorizedView.vue';

export default async function dynamicMount(originalApp, fromSetupProfile) {
    const result = await validateUser();

    let app;

    if (result.authenticated) {
        app = createApp(originalApp);

        if (!result.is_profile_setup) {
            // if profile is not setup set to_setup_profile to true to prevent redirection at setupProfile
            sessionStorage.setItem('to_setup_profile', true);

            // if not from setupProfile then redirect to setupProfile
            if (!fromSetupProfile) {
                location.href = '/setupProfile.html';
            }
        }
    }
    else {
        app = createApp(UnauthorizedView);
        location.href = '/login.html';
    }

    // return app to use other methods if required
    return app;
}