@echo off
echo ========================================
echo   Cookies Cafe E-commerce Setup
echo ========================================
echo.

echo Starting Backend on Port 5001...
start cmd /k "cd /d %~dp0 && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend on Port 3000...
cd /d %~dp0\frontend
start http://localhost:3000
npx serve -p 3000

pause
