# YouTube Real-time Timestamp Marker - Complete Setup

## 🚀 Quick Start

### Step 1: Start the Server
**Windows (Batch):**
```cmd
run_server.bat
```

**Windows (PowerShell):**
```powershell
.\run_server.ps1
```

**Python Direct:**
```bash
python server.py
```

### Step 2: Open in Browser
```
http://localhost:8000
```

### Step 3: Load a YouTube Video
1. Paste YouTube URL in left panel
2. Click "Load Video"
3. Wait 2 seconds for player to initialize

---

## 📱 Layout Overview

```
┌─────────────────────────────────────────────────────┐
│         YouTube Real-time Timestamp Marker          │
├──────────┬──────────────────────┬──────────────────┤
│          │                      │                  │
│  INPUT   │   VIDEO PLAYER       │   TIMESTAMP      │
│  PANEL   │   (Center)           │   & TIMELINE     │
│          │                      │                  │
│  • URL   │ [━━━━━━━━━━━━━━━━]  │  ⏱️ Current     │
│    Input │ [  YouTube Video   ]  │     Time         │
│          │ [━━━━━━━━━━━━━━━━]  │                  │
│  • Load  │                      │  📌 Bookmark    │
│    Video │                      │     Button       │
│          │                      │                  │
│          │                      │  📌 Timeline     │
│          │                      │  ┌──────────────┐│
│          │                      │  │ Bookmark #1  ││
│          │                      │  │ ▶ Play | Del ││
│          │                      │  │ + Comment    ││
│          │                      │  ├──────────────┤│
│          │                      │  │ Bookmark #2  ││
│          │                      │  │ ▶ Play | Del ││
│          │                      │  │ + Comment    ││
│          │                      │  └──────────────┘│
│          │                      │                  │
└──────────┴──────────────────────┴──────────────────┘
```

---

## 🎯 Feature Workflow

### Adding Bookmarks
```
1. Play Video → Find Important Moment → Click 📌 Bookmark
2. Bookmark appears in Timeline with current timestamp
3. Automatically sorted by time
```

### Managing Comments
```
1. Locate bookmark in timeline
2. Type comment in input field
3. Click "Add" to save comment
4. Click "Delete" next to comment to remove it
```

### Playing at Bookmark
```
1. Find the bookmark in timeline
2. Click ▶ Play button
3. Video jumps to that exact timestamp
4. Playback starts automatically
```

### Deleting Bookmarks
```
1. Click 🗑 Delete button on any bookmark
2. Entire bookmark + all comments deleted
3. Cannot be recovered (refresh resets everything)
```

---

## 🔧 Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla, No Dependencies)
- **Backend:** Python SimpleHTTPServer
- **API:** YouTube IFrame API v3
- **Storage:** Browser Memory (Session-based)
- **Browser:** Chrome, Firefox, Safari, Edge (Latest)

---

## 📝 File Structure

```
video_marker/
├── index.html              # Main application
├── styles.css              # All styling (700+ lines)
├── script.js               # Core functionality (380+ lines)
├── server.py               # Python web server
├── run_server.bat          # Windows launcher
├── run_server.ps1          # PowerShell launcher
├── README.md               # Setup & troubleshooting
├── FEATURES.md             # Feature guide
└── QUICKSTART.md           # This file
```

---

## 🎓 Use Cases

### 📚 Educational Videos
- Bookmark key concepts and formulas
- Add explanations in comments
- Review important sections

### 🎬 Video Analysis
- Mark interesting moments
- Add analysis notes
- Navigate quickly

### 🎵 Music & Podcast Timestamps
- Bookmark favorite segments
- Note interesting discussions
- Share timeline with comments

### 👨‍💼 Business Presentations
- Mark action items
- Add follow-up questions
- Track discussion points

---

## ⚙️ Customization

### Change Server Port
Edit `server.py`, line 9:
```python
PORT = 8001  # Change to desired port
```

### Customize Colors
Edit `styles.css`, search for:
- `#667eea` - Primary purple
- `#764ba2` - Gradient purple
- `#4CAF50` - Bookmark button green
- `#f44336` - Delete button red

### Change Update Interval
Edit `script.js`, search for:
```javascript
}, 1000);  // Change 1000 to desired milliseconds
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "postMessage" warning | Use web server (not file://) |
| Player doesn't load | Check URL format, wait 2 seconds |
| Bookmarks disappear | Refresh page clears memory (add export feature) |
| Port already in use | Change PORT in server.py |
| YouTube ads interfere | Use ad blocker or wait for ad to finish |

---

## 📦 Future Features

- [ ] Export bookmarks as CSV/JSON
- [ ] Import previously saved timelines
- [ ] Keyboard shortcuts (B=bookmark, C=comment)
- [ ] Rich text comments with formatting
- [ ] Bookmark categories/tags
- [ ] Search bookmarks by text
- [ ] Share timeline via link
- [ ] Dark mode theme
- [ ] Mobile app version

---

## 📞 Support

1. Check browser console (F12) for errors
2. Verify YouTube URL format
3. Ensure modern browser version
4. Try different YouTube video
5. Restart server if issues persist

---

## 🎉 You're All Set!

Your YouTube Real-time Timestamp Marker is ready to use. Start bookmarking important moments and organizing your video notes!

**Happy marking! 📌⏱️**
