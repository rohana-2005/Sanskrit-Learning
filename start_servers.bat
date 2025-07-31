@echo off
echo 🕉️ Sanskrit Learning System - Windows Startup
echo ===============================================

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Please run this script from the Sanskrit-Learn-System root directory
    echo    Current directory: %CD%
    pause
    exit /b 1
)

echo 🔄 Installing Python dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install requirements
    pause
    exit /b 1
)

echo.
echo 🚀 Starting servers...
echo ===============================================
echo    - Main Dashboard: http://localhost:5000
echo    - Sentence Game Server: http://localhost:5001
echo    - Verb Game Server: http://localhost:5002
echo.
echo 📝 Note: Start your React frontend separately:
echo    cd frontend ^&^& npm run dev
echo.
echo ⚡ Press Ctrl+C to stop all servers
echo ===============================================

cd backend
python app.py

pause
