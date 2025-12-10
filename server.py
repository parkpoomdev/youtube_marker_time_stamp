#!/usr/bin/env python3
"""
Simple HTTP server for YouTube Real-time Timestamp Marker
Run this to serve the app properly and avoid file:// protocol issues
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run_server():
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"✓ Server running at http://localhost:{PORT}")
            print(f"✓ Open in browser: http://localhost:{PORT}")
            print(f"✓ Press Ctrl+C to stop")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Port already in use
            print(f"✗ Error: Port {PORT} is already in use")
            print(f"  Try killing the process or use a different port")
        else:
            print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_server()
