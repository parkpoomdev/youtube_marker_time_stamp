#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add timeline scrubber after the video container
scrubber_html = '''            <!-- Timeline Scrubber -->
            <div class="timeline-scrubber-container">
                <div class="timeline-scrubber-bar">
                    <div class="timeline-scrubber-progress" id="scrubberProgress"></div>
                    <div class="timeline-scrubber-bookmarks" id="scrubberBookmarks"></div>
                    <input 
                        type="range" 
                        id="scrubberInput" 
                        class="timeline-scrubber-input" 
                        min="0" 
                        max="100" 
                        value="0"
                    >
                </div>
                <div class="timeline-scrubber-labels">
                    <span class="timeline-label-start" id="scrubberStart">0:00</span>
                    <span class="timeline-label-duration" id="scrubberDuration">0:00</span>
                </div>
            </div>'''

# Insert after the video-container
insert_point = content.find('</div>\n        </div>\n\n        <!-- Right Section:')
if insert_point > 0:
    content = content[:insert_point] + '\n' + scrubber_html + '\n        </div>\n\n        <!-- Right Section:' + content[insert_point+len('</div>\n        </div>\n\n        <!-- Right Section:'):]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Added timeline scrubber HTML')
