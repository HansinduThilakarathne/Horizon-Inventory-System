#!/bin/bash
# Horizon Campus Inventory - Startup Script (Linux/Mac)

echo "=================================="
echo "Starting Horizon Campus Inventory"
echo "=================================="
echo ""

# Kill any existing node processes
pkill -f "node server-simple.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start Backend
echo "Starting Backend Server (Port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
sleep 3

# Start Frontend  
echo "Starting Frontend Server (Port 5173)..."
cd ..
npm run dev &
FRONTEND_PID=$!
sleep 3

echo ""
echo "=================================="
echo "✅ All servers started!"
echo "=================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop servers, run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
