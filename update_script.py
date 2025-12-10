#!/usr/bin/env python3

# Read the script.js file
with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the YouTube embed URL with autohide parameter
old_url = 'https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1'
new_url = 'https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&autohide=0&fs=1&rel=0'

content = content.replace(old_url, new_url)

# Write back to script.js
with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Updated script.js with autohide=0 parameter')
