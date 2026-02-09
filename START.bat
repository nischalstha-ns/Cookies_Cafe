@echo off
echo ========================================
echo   Cookies Cafe E-commerce Setup
echo ========================================
echo.

echo Step 1: Checking backend dependencies...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo Step 2: Starting backend server...
echo Backend will run on http://localhost:5000
echo.
start cmd /k "cd backend && npm start"

echo.
echo Step 3: Starting frontend...
echo Frontend will open in your browser
echo.
timeout /t 3 /nobreak > nul

cd ..\frontend
start http://localhost:8080
npx serve -p 8080

pause
