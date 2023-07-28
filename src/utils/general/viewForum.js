// to set 'forum_id' in sessionStorage and go to forumGroup.html

export default function viewForum(forumId, openNewTab, threadId, commentId) {
    if (!openNewTab) {
        sessionStorage.setItem('forum_id', forumId);
        location.href = '/forumGroup.html';
    }
    else {
        let targetURL = `${import.meta.env.VITE_BASE_URL}/forumGroup.html`;

        if (threadId) {
            targetURL += `?thread=${threadId}`;

            if (commentId) {
                targetURL += `&comment=${commentId}`;
            }
        }

        const newTab = window.open(targetURL, '_blank');

        if (newTab) {
            newTab.addEventListener('load', () => {
                newTab.sessionStorage.setItem('forum_id', forumId);
            });
        }
        else {
            console.log('Could not open resource in new tab.');
        }
    }
}