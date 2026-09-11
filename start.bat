@echo off
chcp 65001 >nul
title KORFAKHM Start

echo.
echo  ==========================================
echo   KORFAKHM - Zapusk servera
echo  ==========================================
echo.
echo  [1/3] Backend (port 8000)...
start "KORFAKHM Backend :8000" cmd /k C:\tmp\korfakhm_backend.bat

echo  Zhdi 2 sek...
timeout /t 2 /nobreak >nul

echo  [2/3] Frontend (port 5173)...
start "KORFAKHM Frontend :5173" cmd /k C:\tmp\korfakhm_frontend.bat

echo  Zhdi 8 sek poka servery zapustyatsya...
timeout /t 8 /nobreak >nul

echo  [3/3] Otkryvaem brauzer...
start "" http://localhost:5173

echo.
echo  ==========================================
echo   Gotovo!  http://localhost:5173
echo  ==========================================
echo.
pause
