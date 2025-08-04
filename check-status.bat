@echo off
echo Checking Fake Account Detector Status...
echo.

echo Checking Server (Port 5000)...
netstat -ano | findstr ":5000" > nul
if %errorlevel% equ 0 (
    echo ✅ Server is running on port 5000
) else (
    echo ❌ Server is NOT running on port 5000
)

echo.
echo Checking Client (Port 3000)...
netstat -ano | findstr ":3000" > nul
if %errorlevel% equ 0 (
    echo ✅ Client is running on port 3000
) else (
    echo ❌ Client is NOT running on port 3000
)

echo.
echo Checking Internet Connection...
ping -n 1 google.com > nul
if %errorlevel% equ 0 (
    echo ✅ Internet connection is working
) else (
    echo ❌ Internet connection issue detected
)

echo.
echo ========================================
echo Application URLs:
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo ========================================
echo.
echo Press any key to continue...
pause > nul 