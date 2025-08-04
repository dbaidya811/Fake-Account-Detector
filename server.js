const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { analyzeProfile } = require('./services/profileAnalyzer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ error: 'Invalid URL format. Please provide a valid social media profile URL.' });
    }
    
    // Determine which social media platform the URL belongs to
    let platform = '';
    if (url.includes('facebook.com') || url.includes('fb.com')) {
      platform = 'facebook';
    } else if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'twitter';
    } else {
      return res.status(400).json({ error: 'Unsupported social media platform. Please provide a Facebook, Instagram, or Twitter URL.' });
    }
    
    console.log(`Starting analysis for ${platform} profile: ${url}`);
    
    // Analyze the profile with timeout
    const analysisPromise = analyzeProfile(url, platform);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout - the request took too long to complete')), 60000)
    );
    
    const analysis = await Promise.race([analysisPromise, timeoutPromise]);
    
    console.log(`Analysis completed successfully for ${url}`);
    return res.json(analysis);
    
  } catch (error) {
    console.error('Error analyzing profile:', {
      message: error.message,
      stack: error.stack,
      url: req.body?.url
    });
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to analyze profile';
    let statusCode = 500;
    
    if (error.message.includes('Browser initialization failed')) {
      errorMessage = 'System error: Browser initialization failed. Please try again later.';
      statusCode = 503;
    } else if (error.message.includes('Unable to access the profile')) {
      errorMessage = 'Unable to access the profile. The profile might be private, deleted, or the URL might be incorrect.';
      statusCode = 404;
    } else if (error.message.includes('Unable to extract profile information')) {
      errorMessage = 'Unable to extract profile information. The page structure might have changed or the profile might be restricted.';
      statusCode = 422;
    } else if (error.message.includes('Analysis timeout')) {
      errorMessage = 'Analysis timeout - the request took too long to complete. Please try again.';
      statusCode = 408;
    } else if (error.message.includes('Failed to launch browser')) {
      errorMessage = 'System error: Unable to initialize browser. Please ensure all dependencies are installed.';
      statusCode = 503;
    } else {
      errorMessage = `Analysis failed: ${error.message}`;
    }
    
    return res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});