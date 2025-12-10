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
    } catch (e) {
        console.log('Error extracting video ID:', e);
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
    
    // Load iframe with proper parameters - autohide=0 keeps progress bar always visible
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&autohide=0&fs=1&rel=0`;
    
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
