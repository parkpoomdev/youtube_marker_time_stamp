// Get DOM elements
const youtubeUrlInput = document.getElementById('youtubeUrl');
const loadBtn = document.getElementById('loadBtn');
const youtubePlayer = document.getElementById('youtubePlayer');
const timestampValue = document.getElementById('timestampValue');
const timestampRaw = document.getElementById('timestampRaw');
const errorMsg = document.getElementById('errorMsg');
const appendBtn = document.getElementById('appendBtn');
const timelineList = document.getElementById('timelineList');

// State
let ytTimer = null;
let currentVideoId = null;
let playerInstance = null;
let currentTime = 0;
let bookmarks = [];

// Load bookmarks from session storage on page load
function loadBookmarksFromStorage() {
    const stored = sessionStorage.getItem('videoMarkerBookmarks');
    if (stored) {
        try {
            bookmarks = JSON.parse(stored);
            console.log('Loaded ' + bookmarks.length + ' bookmarks from session storage');
        } catch (e) {
            console.log('Error loading bookmarks from storage:', e);
            bookmarks = [];
        }
    }
}

// Save bookmarks to session storage
function saveBookmarksToStorage() {
    sessionStorage.setItem('videoMarkerBookmarks', JSON.stringify(bookmarks));
    console.log('Saved ' + bookmarks.length + ' bookmarks to session storage');
}

// Extract YouTube video ID from URL
function extractVideoId(url) {
    try {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /([a-zA-Z0-9_-]{11})/ // Direct video ID
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    } catch (error) {
        console.error('Error extracting video ID:', error);
        return null;
    }
}

// Load YouTube video
function loadYouTubeVideo() {
    const url = youtubeUrlInput.value.trim();
    
    // Clear previous error message
    errorMsg.classList.remove('show');
    errorMsg.textContent = '';
    
    // Validate input
    if (!url) {
        showError('Please enter a YouTube URL or Video ID');
        return;
    }
    
    // Extract video ID
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        showError('Invalid YouTube URL or Video ID. Please check and try again.');
        return;
    }
    
    // Set video ID and load iframe
    currentVideoId = videoId;
    
    // Remove previous player if exists
    playerInstance = null;
    
    // Load iframe with proper parameters
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1`;
    
    // Clear previous timer
    if (ytTimer) {
        clearInterval(ytTimer);
    }
    
    // Wait for iframe to load, then initialize player
    setTimeout(() => {
        initializePlayer();
    }, 1500);
}

// Show error message
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Start tracking timestamp
function startTimestampTracking() {
    if (ytTimer) {
        clearInterval(ytTimer);
    }
    
    ytTimer = setInterval(updateTimestamp, 1000);
}

// Initialize player with YouTube API
function initializePlayer() {
    try {
        // Ensure YouTube API is loaded
        if (typeof YT === 'undefined' || !YT.loaded) {
            console.log('YouTube API not ready, retrying...');
            setTimeout(initializePlayer, 500);
            return;
        }
        
        // Create player instance
        playerInstance = new YT.Player('youtubePlayer', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch (error) {
        console.log('Player initialization error, will use fallback method');
        startTimestampTracking();
    }
}

// Update timestamp display
function updateTimestamp() {
    try {
        // Try using YouTube API if player is ready
        if (playerInstance && typeof playerInstance.getCurrentTime === 'function') {
            try {
                const currentTime = playerInstance.getCurrentTime();
                if (!isNaN(currentTime) && currentTime >= 0) {
                    updateDisplay(currentTime);
                    return;
                }
            } catch (e) {
                // API call failed, continue
            }
        }
    } catch (error) {
        // Silent fail, will retry next interval
    }
}

// Update the display values
function updateDisplay(seconds) {
    const formatted = formatTime(seconds);
    const raw = seconds.toFixed(2);
    
    currentTime = seconds;
    timestampValue.textContent = formatted;
    timestampRaw.textContent = raw + 's';
    
    // Add pulse animation
    timestampValue.classList.add('updating');
    setTimeout(() => {
        timestampValue.classList.remove('updating');
    }, 300);
}

// Load YouTube API
function loadYouTubeAPI() {
    if (window.YTLoaded) return;
    
    window.YTLoaded = true;
    console.log('Loading YouTube API...');
    
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API callback
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API is ready');
    if (currentVideoId && !playerInstance) {
        initializePlayer();
    }
};

// Player ready callback
function onPlayerReady(event) {
    console.log('YouTube player is ready');
    playerInstance = event.target;
    
    // Start timestamp tracking
    if (ytTimer) {
        clearInterval(ytTimer);
    }
    
    ytTimer = setInterval(() => {
        try {
            const currentTime = event.target.getCurrentTime();
            if (!isNaN(currentTime) && currentTime >= 0) {
                updateDisplay(currentTime);
            }
        } catch (e) {
            // Silent fail
        }
    }, 1000);
}

// Player state change callback
function onPlayerStateChange(event) {
    const states = {
        '-1': 'Unstarted',
        '0': 'Ended',
        '1': 'Playing',
        '2': 'Paused',
        '3': 'Buffering',
        '5': 'Cued'
    };
    console.log('Player state:', states[event.data] || 'Unknown');
}

// Player error callback
function onPlayerError(event) {
    const errorCodes = {
        '2': 'Invalid parameter',
        '5': 'HTML5 player error',
        '100': 'Video not found',
        '101': 'Video cannot be played embedded',
        '150': 'Same as 101'
    };
    const errorMsg = errorCodes[event.data] || 'Unknown error (' + event.data + ')';
    console.error('YouTube Player Error:', errorMsg);
    showError('Video Error: ' + errorMsg);
}

// Event listeners
loadBtn.addEventListener('click', loadYouTubeVideo);

youtubeUrlInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        loadYouTubeVideo();
    }
});

// Bookmark functionality
appendBtn.addEventListener('click', addBookmark);

// Bookmark function
function addBookmark() {
    if (currentVideoId === null) {
        showError('Please load a video first');
        return;
    }
    
    const bookmarkId = 'bookmark_' + Date.now();
    const bookmark = {
        id: bookmarkId,
        time: currentTime,
        formattedTime: formatTime(currentTime),
        title: '',
        comments: [],
        timestamp: new Date().toLocaleTimeString()
    };
    
    bookmarks.push(bookmark);
    bookmarks.sort((a, b) => a.time - b.time);
    
    saveBookmarksToStorage();
    renderTimeline();
}

// Render timeline with bookmarks
function renderTimeline() {
    if (bookmarks.length === 0) {
        timelineList.innerHTML = '<p class="timeline-empty">No bookmarks yet</p>';
        return;
    }
    
    timelineList.innerHTML = bookmarks.map(bookmark => `
        <div class="timeline-item" data-id="${bookmark.id}">
            ${bookmark.title ? `<div class="bookmark-title" ondblclick="editTitle('${bookmark.id}')">📝 ${escapeHtml(bookmark.title)}</div>` : `<div class="bookmark-title" ondblclick="editTitle('${bookmark.id}')">📝 Click to add title</div>`}
            <input type="text" class="bookmark-title-input" 
                   id="title-input-${bookmark.id}"
                   placeholder="Enter title..."
                   value="${escapeHtml(bookmark.title)}"
                   onblur="saveTitle('${bookmark.id}')"
                   onkeypress="handleTitleKeypress(event, '${bookmark.id}')">
            <div class="timeline-header">
                <div class="timeline-time">⏱️ ${bookmark.formattedTime}</div>
                <div class="timeline-actions">
                    <button class="btn-play" onclick="playAtBookmark('${bookmark.id}')">▶ Play</button>
                    <button class="btn-delete" onclick="deleteBookmark('${bookmark.id}')">🗑 Delete</button>
                </div>
            </div>
            ${renderComments(bookmark.id)}
            <div class="timeline-comment-input">
                <textarea class="timeline-comment-text" placeholder="Add a comment..." id="comment-input-${bookmark.id}" rows="2"></textarea>
                <button class="btn-add-comment" onclick="addComment('${bookmark.id}')">Add</button>
            </div>
        </div>
    `).join('');
}

// Render comments for a bookmark
function renderComments(bookmarkId) {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark || bookmark.comments.length === 0) {
        return '';
    }
    
    const commentsList = bookmark.comments.map(comment => `
        <div class="timeline-comment-item" ondblclick="editComment('${bookmarkId}', '${comment.id}')">
            <span class="comment-text" id="comment-text-${comment.id}">${escapeHtml(comment.text)}</span>
            <input 
                type="text"
                class="comment-edit-input"
                id="comment-edit-${comment.id}"
                value="${escapeHtml(comment.text)}"
                onkeypress="handleCommentKeypress(event, '${bookmarkId}', '${comment.id}')"
                onblur="saveComment('${bookmarkId}', '${comment.id}')">
            <span class="comment-delete" onclick="deleteComment('${bookmarkId}', '${comment.id}')">🗑</span>
        </div>
    `).join('');
    
    return `<div class="timeline-comment-list">${commentsList}</div>`;
}

// Add comment to bookmark
function addComment(bookmarkId) {
    const input = document.getElementById(`comment-input-${bookmarkId}`);
    const commentText = input.value.trim();
    
    if (!commentText) {
        alert('Please enter a comment');
        return;
    }
    
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.comments.push({
            id: 'comment_' + Date.now(),
            text: commentText,
            timestamp: new Date().toLocaleTimeString()
        });
        input.value = '';
        saveBookmarksToStorage();
        renderTimeline();
    }
}

// Edit title on double-click
function editTitle(bookmarkId) {
    const input = document.getElementById(`title-input-${bookmarkId}`);
    const titleDiv = input.previousElementSibling;
    
    if (titleDiv) {
        titleDiv.style.display = 'none';
    }
    input.classList.add('active');
    input.focus();
    input.select();
}

// Save title
function saveTitle(bookmarkId) {
    const input = document.getElementById(`title-input-${bookmarkId}`);
    const titleText = input.value.trim();
    
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.title = titleText;
        saveBookmarksToStorage();
        renderTimeline();
    }
}

// Handle Enter key in title input
function handleTitleKeypress(event, bookmarkId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveTitle(bookmarkId);
    }
}

// Delete comment
function deleteComment(bookmarkId, commentId) {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
        bookmark.comments = bookmark.comments.filter(c => c.id !== commentId);
        saveBookmarksToStorage();
        renderTimeline();
    }
}

// Begin editing a comment on double-click
function editComment(bookmarkId, commentId) {
    const textEl = document.getElementById(`comment-text-${commentId}`);
    const inputEl = document.getElementById(`comment-edit-${commentId}`);
    if (!textEl || !inputEl) return;
    textEl.style.display = 'none';
    inputEl.style.display = 'inline-block';
    inputEl.focus();
    inputEl.select();
}

// Save comment edits
function saveComment(bookmarkId, commentId) {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    const inputEl = document.getElementById(`comment-edit-${commentId}`);
    const textEl = document.getElementById(`comment-text-${commentId}`);
    if (!bookmark || !inputEl || !textEl) return;
    const newText = inputEl.value.trim();
    if (!newText) {
        // If cleared, treat as delete
        deleteComment(bookmarkId, commentId);
        return;
    }
    const comment = bookmark.comments.find(c => c.id === commentId);
    if (comment) {
        comment.text = newText;
        saveBookmarksToStorage();
        renderTimeline();
    }
}

// Handle Enter key when editing comment
function handleCommentKeypress(event, bookmarkId, commentId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveComment(bookmarkId, commentId);
    }
}

// Play video at bookmark time
function playAtBookmark(bookmarkId) {
    const bookmark = bookmarks.find(b => b.id === bookmarkId);
    if (bookmark && playerInstance) {
        try {
            playerInstance.seekTo(bookmark.time);
            playerInstance.playVideo();
        } catch (e) {
            console.log('Cannot seek, player may not be ready');
        }
    }
}

// Delete bookmark
function deleteBookmark(bookmarkId) {
    bookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarksToStorage();
    renderTimeline();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.addEventListener('load', () => {
    loadYouTubeAPI();
    loadBookmarksFromStorage();
    if (bookmarks.length > 0) {
        renderTimeline();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (ytTimer) {
        clearInterval(ytTimer);
    }
});

console.log('YouTube Real-time Timestamp Marker loaded');
