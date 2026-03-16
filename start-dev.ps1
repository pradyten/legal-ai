# PowerShell script to start both backend and frontend
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Legal AI Development Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start backend in a new PowerShell window
Write-Host "[1/2] Starting Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; & '$PSScriptRoot\venv\Scripts\Activate.ps1'; python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in a new PowerShell window
Write-Host "[2/2] Starting Frontend (Next.js)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers." -ForegroundColor Gray
