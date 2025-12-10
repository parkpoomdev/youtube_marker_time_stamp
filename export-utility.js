// Add this code to script.js if you want export functionality
// Or save as export-utility.js and link in HTML

/**
 * Export Bookmarks Functionality
 * Add these functions to enable saving/loading bookmarks
 */

// Export bookmarks as JSON
function exportBookmarksJSON() {
    if (bookmarks.length === 0) {
        alert('No bookmarks to export');
        return;
    }
    
    const data = {
        videoId: currentVideoId,
        videTitle: youtubeUrlInput.value,
        exportDate: new Date().toISOString(),
        bookmarks: bookmarks
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, `bookmarks-${currentVideoId}.json`, 'application/json');
}

// Export bookmarks as CSV
function exportBookmarksCSV() {
    if (bookmarks.length === 0) {
        alert('No bookmarks to export');
        return;
    }
    
    let csv = 'Time (M:SS),Raw Time (s),Comments\n';
    
    bookmarks.forEach(bookmark => {
        const comments = bookmark.comments
            .map(c => c.text)
            .join('; ')
            .replace(/"/g, '""'); // Escape quotes
        
        csv += `"${bookmark.formattedTime}","${bookmark.time.toFixed(2)}","${comments}"\n`;
    });
    
    downloadFile(csv, `bookmarks-${currentVideoId}.csv`, 'text/csv');
}

// Import bookmarks from JSON
function importBookmarksJSON(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            // Validate data
            if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
                throw new Error('Invalid bookmarks format');
            }
            
            // Load bookmarks
            bookmarks = data.bookmarks;
            bookmarks.sort((a, b) => a.time - b.time);
            renderTimeline();
            
            alert(`Successfully imported ${bookmarks.length} bookmarks!`);
        } catch (error) {
            alert('Error importing bookmarks: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Helper function to download file
function downloadFile(content, filename, type) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Print bookmarks (for future use)
function printBookmarks() {
    if (bookmarks.length === 0) {
        alert('No bookmarks to print');
        return;
    }
    
    let html = '<h1>Bookmarks - ' + currentVideoId + '</h1>';
    html += '<p>Exported: ' + new Date().toLocaleString() + '</p>';
    
    bookmarks.forEach(bookmark => {
        html += `<h3>${bookmark.formattedTime} (${bookmark.time.toFixed(2)}s)</h3>`;
        
        if (bookmark.comments.length > 0) {
            html += '<ul>';
            bookmark.comments.forEach(comment => {
                html += `<li>${comment.text}</li>`;
            });
            html += '</ul>';
        } else {
            html += '<p><em>No comments</em></p>';
        }
    });
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<pre>' + html + '</pre>');
    printWindow.document.close();
    printWindow.print();
}

/**
 * Future HTML for Export/Import buttons:
 * 
 * <div class="export-section">
 *     <h3>Tools</h3>
 *     <button onclick="exportBookmarksJSON()">📥 Export JSON</button>
 *     <button onclick="exportBookmarksCSV()">📥 Export CSV</button>
 *     <button onclick="document.getElementById('importInput').click()">📤 Import</button>
 *     <button onclick="printBookmarks()">🖨️ Print</button>
 *     <input type="file" id="importInput" style="display:none;" 
 *            onchange="importBookmarksJSON(this.files[0])" accept=".json">
 * </div>
 */
