#!/usr/bin/env python3

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Get DOM elements for scrubber (add after existing DOM queries)
scrubber_dom = '''const scrubberInput = document.getElementById('scrubberInput');
const scrubberProgress = document.getElementById('scrubberProgress');
const scrubberBookmarks = document.getElementById('scrubberBookmarks');
const scrubberStart = document.getElementById('scrubberStart');
const scrubberDuration = document.getElementById('scrubberDuration');
let videoDuration = 0;
'''

# Insert after timelineList declaration
insert_point = content.find('const timelineList = document.getElementById(\'timelineList\');')
if insert_point > 0:
    end_line = content.find('\n', insert_point)
    content = content[:end_line] + '\n' + scrubber_dom + content[end_line:]

# Add updateScrubber function before the window event listeners
scrubber_functions = '''
// Update timeline scrubber
function updateScrubber(time, duration) {
    if (!duration || duration === 0) return;
    videoDuration = duration;
    const progress = (time / duration) * 100;
    scrubberProgress.style.width = progress + '%';
    scrubberInput.max = Math.floor(duration);
    scrubberInput.value = Math.floor(time);
    scrubberStart.textContent = formatTime(time);
    scrubberDuration.textContent = formatTime(duration);
    renderScrubberBookmarks(duration);
}

// Render bookmark markers on scrubber
function renderScrubberBookmarks(duration) {
    scrubberBookmarks.innerHTML = '';
    if (!bookmarks || bookmarks.length === 0) return;
    bookmarks.forEach(bookmark => {
        const position = (bookmark.time / duration) * 100;
        const marker = document.createElement('div');
        marker.className = 'scrubber-bookmark-marker';
        marker.style.left = position + '%';
        marker.onclick = (e) => {
            e.stopPropagation();
            playAtBookmark(bookmark.id);
        };
        marker.title = formatTime(bookmark.time) + ': ' + (bookmark.title || 'Untitled');
        scrubberBookmarks.appendChild(marker);
    });
}

// Handle scrubber input
scrubberInput.addEventListener('input', (e) => {
    const time = parseFloat(e.target.value);
    if (playerInstance && typeof playerInstance.seekTo === 'function') {
        playerInstance.seekTo(time);
    }
});

// Handle scrubber bar click
document.querySelector('.timeline-scrubber-bar').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const time = percent * videoDuration;
    if (playerInstance && typeof playerInstance.seekTo === 'function') {
        playerInstance.seekTo(time);
    }
});
'''

# Insert before window.addEventListener('load'
insert_point = content.find('window.addEventListener(\'load\'')
if insert_point > 0:
    content = content[:insert_point] + scrubber_functions + '\n\n' + content[insert_point:]

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Added timeline scrubber JavaScript')
