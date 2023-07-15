// to set 'user' in sessionStorage and go to profilePage.html

export function viewUser(userId) {
    sessionStorage.setItem('user', userId);

    const profilePageHref = `${import.meta.env.VITE_BASE_URL}/profilePage.html`;

    if (window.location.href != profilePageHref) {
        window.location.href = '/profilePage.html';
    }
    else {
        location.reload();
    }
}