# YouTube Real-time Timestamp Marker

A web application that lets you embed YouTube videos and track their playback timestamp in real-time.

## Features

✨ **Real-time Timestamp Display**
- Shows video timestamp every second
- Displays in both M:SS and decimal format
- Live updates while video plays

🎬 **YouTube Integration**
- Embed any public YouTube video
- Support for multiple URL formats
- Proper error handling for unavailable videos

🎨 **Clean, Responsive UI**
- Three-panel layout (Input | Player | Timestamp)
- Mobile-friendly design
- Gradient modern styling
- Dark mode ready

## Quick Start

### Option 1: Using Python Server (Recommended)

**Windows:**
```bash
# Double-click run_server.bat
# OR open PowerShell and run:
.\run_server.ps1
```

**Mac/Linux:**
```bash
python3 server.py
```

Then open your browser to: **http://localhost:8000**

### Option 2: Using Node.js (if installed)

```bash
npx http-server -p 8000
```

Then open: **http://localhost:8000**

### Option 3: Using Python SimpleHTTPServer

```bash
# Python 3
python -m http.server 8000

# Python 2 (legacy)
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

## How to Use

1. **Start the server** (see Quick Start above)
2. **Open the app** in your browser at `http://localhost:8000`
3. **Paste a YouTube URL** in the left panel:
   - Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Short URL: `https://youtu.be/dQw4w9WgXcQ`
   - Video ID only: `dQw4w9WgXcQ`
4. **Click "Load Video"** and wait 2 seconds for player to initialize
5. **Watch the timestamp** update in the right panel as you play the video

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct Video ID: `VIDEO_ID`

## Project Structure

```
video_marker/
├── index.html        # Main HTML file
├── styles.css        # Styling
├── script.js         # JavaScript functionality
├── server.py         # Python web server
├── run_server.bat    # Windows batch file to run server
├── run_server.ps1    # PowerShell script to run server
└── README.md         # This file
```

## Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No dependencies
- **YouTube IFrame API** - Video embedding and control

### Browser Compatibility
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

### Why You Need a Web Server

The app requires an HTTP server (not `file://` protocol) because:
1. **CORS Security** - YouTube IFrame API requires proper origin headers
2. **JavaScript Restrictions** - Same-origin policy requires HTTP/HTTPS
3. **Cross-origin Communication** - PostMessage API needs proper domains

## Troubleshooting

### Problem: "postMessage" Warning
**Solution:** Use a web server, not `file://` protocol

### Problem: Video doesn't load
**Check:**
- Is the YouTube URL correct?
- Does the video allow embedding? (Some creators disable this)
- Is your internet connection stable?

### Problem: "Video not found" error
**Solution:** Verify the video ID and that the video is public

### Problem: Port 8000 already in use
**Solution:** 
1. Find and kill the process using port 8000
2. Or modify `server.py` to use a different port (e.g., 8001)

## Customization

### Change Server Port
Edit `server.py`:
```python
PORT = 8001  # Change to any available port
```

### Change UI Colors
Edit `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change these color codes */
```

### Change Update Interval
Edit `script.js`:
```javascript
}, 1000);  // 1000ms = 1 second (change to 500 for 0.5s updates)
```

## Features Coming Soon

- 📌 Bookmark timestamps
- 📝 Add notes to specific timestamps
- 💾 Export timestamp log as CSV
- ⏸️ Pause/Resume tracking
- 🔊 Audio visualization
- 🎯 Keyboard shortcuts

## License

Free to use and modify for personal and educational purposes.

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Verify your browser console for error messages (F12)
3. Ensure you're using a modern browser
4. Try a different YouTube video to test

---

**Enjoy tracking YouTube timestamps in real-time! 🎬⏱️**
