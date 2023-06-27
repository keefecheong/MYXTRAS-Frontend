// to set 'forum_id' in sessionStorage and go to forumGroup.html

export default function viewForum(forumId) {
    sessionStorage.setItem('forum_id', forumId);
    window.location.href = '/forumGroup.html';
}