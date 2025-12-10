#!/usr/bin/env python3
with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Find .timestamp-section and add opacity and transition
old = """.timestamp-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 0;
    display: flex;
    flex-direction: column;
}"""

new = """.timestamp-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 0;
    display: flex;
    flex-direction: column;
    opacity: 0.15;
    transition: opacity 0.3s ease;
}

.container:hover .timestamp-section {
    opacity: 1;
}"""

if old in content:
    content = content.replace(old, new)
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("✅ Added hover effect to timeline panel")
else:
    print("Could not find pattern")
