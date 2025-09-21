@echo off
echo Starting Runware Demo Development Environment

echo.
echo Starting Python Service...
start "Python Service" cmd /k "cd python-service && venv\Scripts\activate && py app.py"

timeout /t 3 > nul

echo.
echo Starting Node.js Backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 > nul

echo.
echo Starting React Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services starting...
echo Frontend: http://localhost:5174
echo Backend: http://localhost:3000
echo Python: http://localhost:5005
echo.
echo Press any key to exit...
pause > nul