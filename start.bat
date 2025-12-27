@echo off
REM IDeal.ie - Quick Start Script for Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║   IDeal.ie Quick Start                 ║
echo ║   Car Marketplace for Ireland          ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: frontend folder not found!
    echo Please run this script from: C:\Local\IDeal\carmarket-ie
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: backend folder not found!
    echo Please run this script from: C:\Local\IDeal\carmarket-ie
    pause
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Ask user what to do
echo Choose an option:
echo 1. Install all dependencies
echo 2. Start frontend only
echo 3. Start backend only
echo 4. Start both (requires 2 terminals)
echo 5. View setup guide
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
    echo ✅ Dependencies installed!
    echo.
    echo Next steps:
    echo - Terminal 1: cd frontend && npm run dev
    echo - Terminal 2: cd backend && npm run dev
    pause
) else if "%choice%"=="2" (
    echo.
    echo Starting frontend on http://localhost:3000
    cd frontend
    npm run dev
) else if "%choice%"=="3" (
    echo.
    echo Starting backend on http://localhost:5000
    cd backend
    npm run dev
) else if "%choice%"=="4" (
    echo.
    echo You need TWO terminal windows for this.
    echo Opening frontend terminal...
    start "IDeal Frontend" powershell -NoExit -Command "cd frontend; npm run dev"
    timeout /t 2 > nul
    echo Opening backend terminal...
    start "IDeal Backend" powershell -NoExit -Command "cd backend; npm run dev"
) else if "%choice%"=="5" (
    echo.
    echo Opening SETUP.md...
    start notepad SETUP.md
) else (
    echo ❌ Invalid choice!
)

pause
