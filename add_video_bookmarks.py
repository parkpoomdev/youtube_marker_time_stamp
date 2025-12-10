#!/usr/bin/env python3

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add video-specific bookmark functions after loadBookmarksFromStorage
new_functions = '''
// Save bookmarks for a specific video
function saveVideoBookmarks(videoId) {
    if (!videoId) return;
    const storageKey = 'bookmarks_' + videoId;
    sessionStorage.setItem(storageKey, JSON.stringify(bookmarks));
    console.log('Saved bookmarks for video ' + videoId);
}

// Load bookmarks for a specific video
function loadVideoBookmarks(videoId) {
    if (!videoId) return null;
    const storageKey = 'bookmarks_' + videoId;
    try {
        const stored = sessionStorage.getItem(storageKey);
        if (stored) {
            const data = JSON.parse(stored);
            console.log('Loaded ' + data.length + ' bookmarks for video ' + videoId);
            return data;
        }
    } catch (e) {
        console.log('Error loading bookmarks for video ' + videoId);
    }
    return null;
}
'''

# Insert before the Extract YouTube video ID function
insert_point = content.find('// Extract YouTube video ID from URL')
if insert_point > 0:
    content = content[:insert_point] + new_functions + '\n' + content[insert_point:]

# Update loadYouTubeVideo to use video-specific bookmarks
old_load_start = '''    // Set video ID and load iframe
    currentVideoId = videoId;'''

new_load_start = '''    // If video ID changed, save old bookmarks and load new ones
    if (currentVideoId && currentVideoId !== videoId) {
        saveVideoBookmarks(currentVideoId);
        bookmarks = loadVideoBookmarks(videoId) || [];
        renderTimeline();
    } else if (!currentVideoId) {
        // First video load
        bookmarks = loadVideoBookmarks(videoId) || [];
    }
    
    // Set video ID and load iframe
    currentVideoId = videoId;'''

content = content.replace(old_load_start, new_load_start)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Added video-specific bookmark functions')
