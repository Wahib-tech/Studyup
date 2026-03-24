@echo off
setlocal enabledelayedexpansion
title StudyUp - Increment Runner
echo ========================================
echo   StudyUp - Incremental Development
echo ========================================
echo.
echo Select an increment to run:
echo 1. Authentication & User Management
echo 2. Student Management
echo 3. Course & Section Management
echo 4. Subject Management
echo 5. Grades & Academic History
echo 6. AI Quiz Generation
echo 7. Todo & Task Manager
echo 8. Communication & Notifications
echo 9. Reports & Analytics
echo.

set /p choice="Enter selection (1-9): "

if "%choice%"=="1" set folder=increment-1-authentication-user-management
if "%choice%"=="2" set folder=increment-2-student-management
if "%choice%"=="3" set folder=increment-3-course-section-management
if "%choice%"=="4" set folder=increment-4-subject-management
if "%choice%"=="5" set folder=increment-5-grades-academic-history
if "%choice%"=="6" set folder=increment-6-ai-quiz-generation
if "%choice%"=="7" set folder=increment-7-todo-task-manager
if "%choice%"=="8" set folder=increment-8-communication-notifications
if "%choice%"=="9" set folder=increment-9-reports-analytics

if not defined folder (
    echo Invalid selection.
    pause
    exit /b
)

set ROOT=D:\IGNOU PROJECT\StudyUp\increments\!folder!
echo Starting !folder!...

echo.
set /p install="Do you want to run 'npm install' first? (y/n): "

if /i "%install%"=="y" (
    echo [1/4] Installing Backend Dependencies...
    cd /d "!ROOT!\backend" && call npm install
    echo [2/4] Installing Frontend Dependencies...
    cd /d "!ROOT!\frontend" && call npm install
)

echo [3/4] Starting Backend Server...
start "!folder! - Backend" cmd /k "cd /d !ROOT!\backend && npm run dev"

timeout /t 2 /nobreak > nul

echo [4/4] Starting Frontend App...
start "!folder! - Frontend" cmd /k "cd /d !ROOT!\frontend && npm run dev"

echo.
echo ========================================
echo   Services starting for !folder!
echo   Backend  : http://localhost:4000
echo   Frontend : http://localhost:3000
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:3000

pause
