@echo off
title StudyUp - Starting Services
echo ========================================
echo   StudyUp - Starting Active Increment (9)
echo ========================================

set INC_DIR=d:\IGNOU PROJECT\StudyUp\increments\increment-9-reports-analytics

echo.
echo [1/2] Starting Backend Server...
start "StudyUp - Backend" cmd /k "cd /d %INC_DIR%\backend && npm run dev"

timeout /t 2 /nobreak > nul

echo [2/2] Starting Frontend App...
start "StudyUp - Frontend" cmd /k "cd /d %INC_DIR%\frontend && npm run dev"

echo.
echo ========================================
echo   Both services started!
echo   Backend  : http://localhost:4000
echo   Frontend : http://localhost:3000
echo ========================================
timeout /t 3 /nobreak > nul
