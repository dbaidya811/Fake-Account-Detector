# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to analyze profile" Error

**Possible Causes:**
- Browser initialization failed
- Network connectivity issues
- Invalid or private profile URL
- Anti-bot measures blocking access

**Solutions:**
1. **Check URL Format**: Ensure you're using a valid social media profile URL
   - Facebook: `https://www.facebook.com/username`
   - Instagram: `https://www.instagram.com/username`
   - Twitter: `https://twitter.com/username` or `https://x.com/username`

2. **Verify Profile Accessibility**: Make sure the profile is public and accessible

3. **Check Internet Connection**: Ensure you have a stable internet connection

4. **Try Again Later**: Some social media platforms may temporarily block automated access

### 2. "Browser initialization failed" Error

**Possible Causes:**
- Puppeteer not properly installed
- Missing system dependencies
- Insufficient system resources

**Solutions:**
1. **Reinstall Dependencies**: Run the installation script again
   ```bash
   install.bat
   ```

2. **Install Puppeteer Browser**: Manually install the browser
   ```bash
   npx puppeteer browsers install chrome
   ```

3. **Check System Requirements**: Ensure you have at least 2GB RAM available

### 3. "Analysis timeout" Error

**Possible Causes:**
- Slow internet connection
- Social media platform is slow to respond
- System resources are limited

**Solutions:**
1. **Check Internet Speed**: Ensure you have a fast, stable connection
2. **Close Other Applications**: Free up system resources
3. **Try Again**: The timeout is set to 60 seconds, try the analysis again

### 4. "Unable to access the profile" Error

**Possible Causes:**
- Profile is private
- Profile has been deleted
- URL is incorrect
- Profile is restricted

**Solutions:**
1. **Verify URL**: Double-check the profile URL for typos
2. **Check Profile Privacy**: Ensure the profile is public
3. **Try Different Profile**: Test with a known public profile

### 5. "Network error" Error

**Possible Causes:**
- No internet connection
- Firewall blocking the request
- Proxy or VPN issues

**Solutions:**
1. **Check Internet Connection**: Ensure you're connected to the internet
2. **Disable VPN/Proxy**: Try without VPN or proxy
3. **Check Firewall**: Ensure the application is allowed through your firewall

## System Requirements

- **Operating System**: Windows 10/11, macOS 10.14+, or Linux
- **Node.js**: Version 16 or higher
- **RAM**: At least 2GB available
- **Storage**: At least 500MB free space
- **Internet**: Stable broadband connection

## Installation Issues

### If `npm install` fails:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Update npm**:
   ```bash
   npm install -g npm@latest
   ```

### If Puppeteer installation fails:

1. **Install system dependencies** (Linux):
   ```bash
   sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

2. **Use system Chrome** (if available):
   ```bash
   export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
   ```

## Development Mode Issues

### If the development server won't start:

1. **Check if ports are in use**:
   - Server port 5000
   - Client port 3000

2. **Kill existing processes**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

3. **Start servers separately**:
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   npm run client
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the console logs** for detailed error messages
2. **Try with a different profile URL** to isolate the issue
3. **Restart the application** completely
4. **Check the debug screenshot** (if generated) in the project root

## Performance Tips

- Close unnecessary browser tabs and applications
- Use a wired internet connection when possible
- Ensure adequate system resources are available
- Try analysis during off-peak hours when social media platforms are less busy 