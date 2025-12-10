#!/usr/bin/env python3

# Add CSS for timeline scrubber
css_addition = '''
/* Timeline Scrubber Bar */
.timeline-scrubber-container {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.timeline-scrubber-bar {
    width: 100%;
    height: 40px;
    background: #f0f0f0;
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border: 1px solid #ddd;
}

.timeline-scrubber-progress {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    width: 0%;
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.1s linear;
}

.timeline-scrubber-bookmarks {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
}

.scrubber-bookmark-marker {
    width: 3px;
    height: 100%;
    background: #ff5722;
    opacity: 0.7;
    position: absolute;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.scrubber-bookmark-marker:hover {
    opacity: 1;
    width: 5px;
}

.timeline-scrubber-input {
    width: 100%;
    height: 40px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}

.timeline-scrubber-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #667eea;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-top: 12px;
}

.timeline-scrubber-input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #667eea;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-top: 12px;
}

.timeline-scrubber-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    font-family: monospace;
    padding: 0 4px;
}
'''

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Add at the end before the media queries
insert_point = content.find('@media (max-width:')
if insert_point > 0:
    content = content[:insert_point] + css_addition + '\n' + content[insert_point:]
else:
    # If no media queries, add at the end
    content += '\n' + css_addition

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Added timeline scrubber CSS')
