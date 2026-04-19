@echo off
REM Horizon Campus Inventory - Complete Startup Script
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo HORIZON CAMPUS INVENTORY STARTUP
echo ========================================
echo.

REM Change to project root
cd /d "d:\Campus\Final Ye\horizon-inventory"

REM Kill any existing node processes
echo Cleaning up old processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend Server
echo.
echo Starting Backend Server (Port 5000)...
echo.
start "Horizon Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 4 /nobreak >nul

REM Start Frontend Server
echo.
echo Starting Frontend Server (Port 5173)...
echo.
start "Horizon Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo STARTUP COMPLETE
echo ========================================
echo.
echo Backend URL:  http://localhost:5000
echo Frontend URL: http://localhost:5173
echo.
echo Servers are starting in separate windows...
echo.
pause
