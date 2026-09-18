// check if user is authenticated
export default async function validateUser() {
    let result;

    await fetch(
        `${process.env.APP_SERVER_URL}/api/users/cookie/verify`,
        {
            method: "get",
            credentials: "include",
        },
    )
        .then(async (res) => {
            if (res.status == 200) {
                await res.json().then((user) => {
                    result = {
                        authenticated: true,
                        is_profile_setup: user.is_profile_setup,
                        is_admin: user.is_admin,
                        warning: user?.warnings?.filter(
                            (warning) => !warning.acknowledged,
                        )[0],
                    };
                });
            } else {
                // if not authenticated clear local and session storage
                localStorage.clear();
                sessionStorage.clear();
            }
        })
        .catch((error) => {
            void error;
        });

    return result;
}
