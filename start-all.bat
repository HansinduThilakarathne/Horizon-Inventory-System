@echo off
echo Starting Horizon Campus Inventory System...
echo.

REM Kill any existing node processes
taskkill /F /IM node.exe /T 2>nul

REM Wait a moment
timeout /t 2 /nobreak

REM Start Backend Server in new window
echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k cd backend && npm start

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend Server in new window
echo Starting Frontend Server (Port 5173)...
start "Frontend Server" cmd /k npm run dev

REM Wait and open browser
timeout /t 3 /nobreak
echo.
echo ===================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================
echo All servers started successfully!
echo.
