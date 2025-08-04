@echo off
echo Installing Fake Account Detector dependencies...
echo.

echo Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Installing Puppeteer browser...
call npx puppeteer browsers install chrome
if %errorlevel% neq 0 (
    echo Warning: Failed to install Puppeteer browser, but the application may still work
)

echo.
echo All dependencies installed successfully!
echo.
echo To start the development server, run: npm run dev-all
echo To start the production server, run: npm start
echo.
pause