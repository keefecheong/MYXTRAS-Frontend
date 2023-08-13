// to set 'user' in sessionStorage and go to profilePage.html
// newTab, postId, and commentId parameters to link directly to the reported content
export default function viewUser(userId, openNewTab, postId, commentId) {
    var profilePageHref = `${import.meta.env.VITE_BASE_URL}/profilePage.html/`;

    if (!openNewTab) {
        sessionStorage.setItem("user", userId);

        if (window.location.href != profilePageHref) {
            window.location.href = "/profilePage.html";
        } else {
            location.reload();
        }
    } else {
        if (postId) {
            profilePageHref += `?post=${postId}`;

            if (commentId) {
                profilePageHref += `&comment=${commentId}`;
            }
        }

        // open in new tab
        const newTab = window.open(profilePageHref, "_blank");

        // set userId in sessionStorage
        if (newTab) {
            newTab.addEventListener("load", () => {
                newTab.sessionStorage.setItem("user", userId);
            });
        } else {
            console.log("Could not open resource in new tab.");
        }
    }
}
