@echo off
echo ========================================
echo Starting Legal AI Development Servers
echo ========================================
echo.

:: Start backend in a new window
echo [1/2] Starting Backend (FastAPI)...
start "Legal AI - Backend" cmd /k "venv\Scripts\activate && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend in a new window
echo [2/2] Starting Frontend (Next.js)...
start "Legal AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
