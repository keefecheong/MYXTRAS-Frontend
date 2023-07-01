// to set 'user' in sessionStorage and go to profilePage.html

export function viewUser(userId) {
    sessionStorage.setItem('user', userId);
    window.location.href = '/profilePage.html';
}

export function viewFollower(userId) {
    sessionStorage.setItem('followerId', userId);
    window.location.href = '/profilePage.html';
}