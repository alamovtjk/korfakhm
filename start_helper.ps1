Write-Host ""
Write-Host "  KORFAKHM - Zapusk" -ForegroundColor Cyan
Write-Host "  ==================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Backend (port 8000)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k C:\tmp\korfakhm_backend.bat"

Start-Sleep 2

Write-Host "[2/3] Frontend (port 5173)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k C:\tmp\korfakhm_frontend.bat"

Write-Host ""
Write-Host "  Zhdi 8 sekund..." -ForegroundColor Yellow
Start-Sleep 8

Write-Host "[3/3] Otkryvaem brauzer..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "  ================================" -ForegroundColor Green
Write-Host "  Gotovo! http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "  ================================" -ForegroundColor Green
Write-Host ""
