// to set 'user' in sessionStorage and go to profilePage.html

export default function viewUser(userId) {
    sessionStorage.setItem('user', userId);
    window.location.href = '/profilePage.html';
}