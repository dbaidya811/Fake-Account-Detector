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
    
    // Analyze the profile
    const analysis = await analyzeProfile(url, platform);
    
    return res.json(analysis);
  } catch (error) {
    console.error('Error analyzing profile:', error);
    return res.status(500).json({ error: 'Failed to analyze profile', details: error.message });
  }
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
});