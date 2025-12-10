#!/usr/bin/env python3
import os

# Change to the correct directory
os.chdir(r'c:\Users\smart-lab-pc\Documents\workspace_dev\video_marker')

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the YouTube embed URL with autohide parameter
old = "youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1`;"
new = "youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&autohide=0&fs=1&rel=0`;"

if old in content:
    content = content.replace(old, new)
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Updated script.js with autohide=0 parameter")
else:
    print("❌ Could not find the pattern to replace")
    print("Looking for autohide in existing file...")
    if 'autohide' in content:
        print("autohide already present")
    else:
        print("autohide not found - will check actual content")
