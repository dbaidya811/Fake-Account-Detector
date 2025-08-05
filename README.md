# Fake Account Detector

A web application that analyzes social media profiles (Facebook, Instagram, Twitter) to determine if they are real or fake accounts using AI-powered analysis.

## 🚀 Features

- **Multi-Platform Support**: Analyze Facebook, Instagram, and Twitter profiles
- **AI-Powered Analysis**: Uses advanced algorithms to detect fake accounts
- **Detailed Reports**: Provides comprehensive breakdown of suspicious indicators
- **Real-time Analysis**: Instant results with detailed explanations
- **User-Friendly Interface**: Clean, modern UI with Bootstrap styling
- **Profile Picture Analysis**: Analyzes profile photos for authenticity

## 🛠️ Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Windows 10/11, macOS 10.14+, or Linux

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dbaidya811/Fake-Account-Detector.git
   cd Fake-Account-Detector
   ```

2. **Install dependencies**
   ```bash
   # Run the installation script (Windows)
   install.bat
   
   # Or manually install
   npm install
   cd client && npm install
   ```

3. **Start the application**
   ```bash
   # Easy way (Windows)
   start-app.bat
   
   # Or manually start both servers
   npm run dev-all
   ```

## 🎯 Usage

1. **Open your browser** and go to `http://localhost:3000`
2. **Enter a social media profile URL** (Facebook, Instagram, or Twitter)
3. **Click "Analyze Profile"** to start the analysis
4. **View the results** with detailed breakdown of indicators

### Supported URL Formats
- Facebook: `https://www.facebook.com/username`
- Instagram: `https://www.instagram.com/username`
- Twitter: `https://twitter.com/username` or `https://x.com/username`

## 🔧 Development

### Project Structure
```
Fake-Account-Detector/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── ...
├── services/              # Backend services
│   └── profileAnalyzer.js # Main analysis logic
├── server.js              # Express server
└── package.json           # Dependencies
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run client` - Start React development server
- `npm run dev-all` - Start both servers concurrently
- `npm start` - Start production server

## 🚨 Troubleshooting

### Common Issues

1. **"Network error" message**
   - Ensure both server (port 5000) and client (port 3000) are running
   - Check your internet connection
   - Try refreshing the page

2. **"Failed to analyze profile" error**
   - Verify the profile URL is correct and public
   - Check if the profile exists and is accessible
   - Try with a different profile

3. **Browser initialization failed**
   - Run `install.bat` to reinstall dependencies
   - Ensure you have at least 2GB RAM available
   - Check the troubleshooting guide for more details

### Getting Help
- Check the `TROUBLESHOOTING.md` file for detailed solutions
- Ensure all dependencies are properly installed
- Try restarting the application completely

## 🛡️ How It Works

The application uses multiple analysis techniques:

1. **Profile Data Analysis**
   - Username patterns and suspicious naming conventions
   - Bio information completeness
   - Account age and activity patterns

2. **Social Indicators**
   - Follower/following ratios
   - Post frequency and content quality
   - Engagement patterns

3. **Technical Analysis**
   - Profile picture authenticity
   - Account creation patterns
   - Activity consistency

4. **AI Scoring**
   - Machine learning algorithms
   - Pattern recognition
   - Risk assessment scoring

## 📊 Analysis Results

The application provides:
- **Overall Score**: 0-100 authenticity rating
- **Risk Level**: Low, Medium, or High risk
- **Detailed Indicators**: Specific factors affecting the score
- **Recommendations**: Actions to take based on results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **GitHub Repository**: [https://github.com/dbaidya811/Fake-Account-Detector](https://github.com/dbaidya811/Fake-Account-Detector)

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting guide
2. Review the console logs for error messages
3. Try with different profile URLs
4. Ensure all dependencies are up to date

---

**Note**: <div style="padding: 15px; background-color: #ffeb3b; color: #000; border-radius: 5px; font-weight: bold; border: 1px solid #f1c40f;">
  ⚠️ <strong>Disclaimer:</strong> This tool is designed to help detect potentially fake accounts. <br>
  Results may not always be 100% accurate. Use your own judgment and verify from multiple sources if needed.
</div>
