#!/usr/bin/env python3

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update updateDisplay to call updateScrubber
old_display = '''// Update the display values
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
}'''

new_display = '''// Update the display values
function updateDisplay(seconds) {
    const formatted = formatTime(seconds);
    const raw = seconds.toFixed(2);
    
    currentTime = seconds;
    timestampValue.textContent = formatted;
    timestampRaw.textContent = raw + 's';
    
    // Update scrubber
    if (playerInstance && typeof playerInstance.getDuration === 'function') {
        try {
            const duration = playerInstance.getDuration();
            updateScrubber(seconds, duration);
        } catch (e) {
            // Silent
        }
    }
    
    // Add pulse animation
    timestampValue.classList.add('updating');
    setTimeout(() => {
        timestampValue.classList.remove('updating');
    }, 300);
}'''

content = content.replace(old_display, new_display)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Updated updateDisplay to include scrubber')
