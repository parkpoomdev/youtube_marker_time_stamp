// React Timeline Component for Video Bookmarks
const { useState, useEffect, useRef } = React;

// Format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Video Timeline Component
function VideoTimeline({ bookmarks = [], videoDuration = 0, currentTime = 0, onBookmarkClick }) {
    const timelineRef = useRef(null);
    const [hoveredBookmark, setHoveredBookmark] = useState(null);

    // Calculate position percentage for a bookmark
    const getBookmarkPosition = (bookmarkTime) => {
        if (videoDuration === 0) return 0;
        return (bookmarkTime / videoDuration) * 100;
    };

    // Calculate current time position
    const getCurrentTimePosition = () => {
        if (videoDuration === 0) return 0;
        return (currentTime / videoDuration) * 100;
    };

    // Handle timeline click to seek
    const handleTimelineClick = (e) => {
        if (!timelineRef.current || videoDuration === 0) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        const seekTime = percent * videoDuration;
        
        // Trigger seek in parent (vanilla JS)
        if (window.seekToTime && typeof window.seekToTime === 'function') {
            window.seekToTime(seekTime);
        }
    };

    // Handle bookmark marker click
    const handleBookmarkClick = (bookmark, e) => {
        e.stopPropagation();
        if (onBookmarkClick) {
            onBookmarkClick(bookmark);
        }
        // Also trigger seek
        if (window.seekToTime && typeof window.seekToTime === 'function') {
            window.seekToTime(bookmark.time);
        }
    };

    if (videoDuration === 0) {
        return (
            <div className="react-timeline-container">
                <div className="react-timeline-empty">
                    Load a video to see the timeline
                </div>
            </div>
        );
    }

    return (
        <div className="react-timeline-container">
            <div className="react-timeline-header">
                <span className="react-timeline-title">Video Timeline</span>
                <span className="react-timeline-duration">{formatTime(videoDuration)}</span>
            </div>
            <div 
                ref={timelineRef}
                className="react-timeline-bar"
                onClick={handleTimelineClick}
            >
                {/* Progress indicator */}
                <div 
                    className="react-timeline-progress"
                    style={{ width: `${getCurrentTimePosition()}%` }}
                />
                
                {/* Bookmark vertical lines */}
                {bookmarks.map((bookmark) => {
                    const position = getBookmarkPosition(bookmark.time);
                    const isHovered = hoveredBookmark === bookmark.id;
                    
                    return (
                        <div
                            key={bookmark.id}
                            className={`react-timeline-marker ${isHovered ? 'hovered' : ''}`}
                            style={{ left: `${position}%` }}
                            onClick={(e) => handleBookmarkClick(bookmark, e)}
                            onMouseEnter={() => setHoveredBookmark(bookmark.id)}
                            onMouseLeave={() => setHoveredBookmark(null)}
                            title={bookmark.title || `Bookmark at ${bookmark.formattedTime}`}
                        >
                            {isHovered && (
                                <div className="react-timeline-tooltip">
                                    <div className="tooltip-time">{bookmark.formattedTime}</div>
                                    {bookmark.title && (
                                        <div className="tooltip-title">{bookmark.title}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {/* Time labels at intervals */}
                <div className="react-timeline-labels">
                    {Array.from({ length: Math.ceil(videoDuration / 60) + 1 }, (_, i) => {
                        const time = i * 60;
                        if (time > videoDuration) return null;
                        const position = (time / videoDuration) * 100;
                        return (
                            <div
                                key={time}
                                className="react-timeline-label"
                                style={{ left: `${position}%` }}
                            >
                                {formatTime(time)}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="react-timeline-footer">
                <span className="react-timeline-current">{formatTime(currentTime)}</span>
                <span className="react-timeline-bookmarks-count">
                    {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                </span>
            </div>
        </div>
    );
}

// Main App Component to manage timeline state
function TimelineApp() {
    const [bookmarks, setBookmarks] = useState([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Function to update timeline from vanilla JS
    window.updateTimeline = function(newBookmarks, duration, time) {
        setBookmarks(newBookmarks || []);
        setVideoDuration(duration || 0);
        setCurrentTime(time || 0);
    };

    // Handle bookmark click
    const handleBookmarkClick = (bookmark) => {
        // This will be handled by the seekToTime function
        console.log('Bookmark clicked:', bookmark);
    };

    // Poll for updates from vanilla JS (fallback method)
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.getBookmarks && typeof window.getBookmarks === 'function') {
                const data = window.getBookmarks();
                if (data) {
                    setBookmarks(data.bookmarks || []);
                    setVideoDuration(data.duration || 0);
                    setCurrentTime(data.currentTime || 0);
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <VideoTimeline
            bookmarks={bookmarks}
            videoDuration={videoDuration}
            currentTime={currentTime}
            onBookmarkClick={handleBookmarkClick}
        />
    );
}

// Render the React app when DOM is ready
function renderTimelineApp() {
    const rootElement = document.getElementById('react-timeline-root');
    if (!rootElement) {
        console.error('React timeline root element not found');
        return;
    }
    
    // Use React 18 createRoot if available, otherwise fallback to ReactDOM.render
    if (ReactDOM.createRoot) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<TimelineApp />);
    } else {
        // Fallback for older React versions
        ReactDOM.render(<TimelineApp />, rootElement);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTimelineApp);
} else {
    // DOM is already ready
    setTimeout(renderTimelineApp, 100);
}

