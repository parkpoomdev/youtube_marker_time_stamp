# YouTube Real-time Timestamp Marker Server
# Run this script to start the local server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "YouTube Real-time Timestamp Marker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Run the server
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
python "$scriptPath\server.py"
