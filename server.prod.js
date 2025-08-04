const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { analyzeProfile } = require('./services/profileAnalyzer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

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
    
    // Determine which social media platform the URL belongs to
    let platform = '';
    if (url.includes('facebook.com') || url.includes('fb.com')) {
      platform = 'facebook';
    } else if (url.includes('instagram.com')) {
      platform = 'instagram';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'twitter';
    } else {
      return res.status(400).json({ 
        error: 'Unsupported social media platform. Please provide a Facebook, Instagram, or Twitter URL.' 
      });
    }
    
    // Analyze the profile with detailed error handling
    console.log(`Starting analysis for ${url} (${platform})`);
    const analysis = await analyzeProfile(url, platform).catch(err => {
      console.error('Error in analyzeProfile:', err);
      throw err;
    });
    console.log('Analysis completed successfully');
    return res.json(analysis);
  } catch (error) {
    console.error('Error analyzing profile:', {
      message: error.message,
      stack: error.stack,
      url: req.body.url,
      platform: platform || 'unknown'
    });
    return res.status(500).json({ 
      error: 'Failed to analyze profile', 
      details: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
