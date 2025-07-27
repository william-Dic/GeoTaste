@echo off
echo ========================================
echo    GeoTaste Project Startup Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking if Python is installed...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd Backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Starting GeoTaste Application
echo ========================================
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo.

npm run start-full 