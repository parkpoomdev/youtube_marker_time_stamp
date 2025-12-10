@echo off
REM YouTube Real-time Timestamp Marker Server
REM Run this file to start the local server

echo.
echo ========================================
echo YouTube Real-time Timestamp Marker
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Run the server
echo Starting server...
python "%~dp0server.py"
