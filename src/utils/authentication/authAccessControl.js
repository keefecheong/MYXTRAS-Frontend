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

export default async function dynamicMount(originalApp) {
    const result = await validateUser();

    let app;

    if (result.authenticated) {
        // if profile setup complete then go to original page
        if (result.is_profile_setup) {
            app = createApp(originalApp);
        }
        // otherwise go to setupProfile.html
        else {
            location.href = '/setupProfile.html';
        }
    }
    else {
        // if not authenticated then go to login.html
        app = createApp(UnauthorizedView);
        location.href = '/login.html';
    }

    // return app to use other methods if required
    return app;
}