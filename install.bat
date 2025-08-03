@echo off
echo Installing server dependencies...
npm install

echo.
echo Creating client node_modules directory...
cd client
mkdir node_modules

echo.
echo Installing client dependencies...
npm install

echo.
echo Installation complete!
echo To start the development server, run: npm run dev-all
cd ..