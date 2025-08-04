const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Create temp directory for downloaded images if it doesn't exist
const TEMP_DIR = path.join(__dirname, '../temp');
(async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (err) {
    // Directory might already exist
  }
})();

/**
 * Analyzes a social media profile to determine if it's real or fake
 * @param {string} url - The URL of the profile to analyze
 * @param {string} platform - The social media platform (facebook, instagram, twitter)
 * @returns {Object} Analysis results
 */
/**
 * Downloads a profile picture from a URL
 * @param {string} imageUrl - URL of the profile picture
 * @param {string} platform - Social media platform
 * @param {string} username - Username for file naming
 * @returns {Promise<string>} Path to the downloaded image
 */
async function downloadProfilePicture(imageUrl, platform, username) {
  try {
    if (!imageUrl) return null;
    
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
    
    // Generate a filename
    const filename = `${platform}_${username}_${Date.now()}.jpg`;
    const filePath = path.join(tempDir, filename);
    
    // Download the image
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    
    // Save the image
    await fs.writeFile(filePath, response.data);
    
    return filePath;
  } catch (error) {
    console.error('Error downloading profile picture:', error);
    return null;
  }
}

/**
 * Analyzes a profile picture to determine if it's a real human or stock photo
 * @param {string} imagePath - Path to the profile picture
 * @returns {Object} Analysis results
 */
async function analyzeProfilePicture(imagePath) {
  try {
    if (!imagePath) return { isHuman: false, confidence: 0, stockPhoto: false };
    
    // In a production environment, you would integrate with a face detection API
    // such as AWS Rekognition, Google Vision API, or Microsoft Azure Face API
    // For this implementation, we'll use a simple heuristic based on image properties
    
    // Get image file stats
    const stats = await fs.stat(imagePath);
    const fileSizeInKB = stats.size / 1024;
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    
    // Simple heuristics:
    // 1. Very small images are less likely to be real profile photos
    // 2. Very large images might be high-quality stock photos
    // 3. Medium-sized images are more likely to be real user photos
    
    let isHuman = true;
    let stockPhoto = false;
    let confidence = 0.7; // Default confidence
    
    if (fileSizeInKB < 5) {
      // Very small images are suspicious
      isHuman = false;
      confidence = 0.6;
    } else if (fileSizeInKB > 500) {
      // Very large, high-quality images might be stock photos
      stockPhoto = true;
      confidence = 0.65;
    } else {
      // Medium-sized images are more likely to be real user photos
      isHuman = true;
      confidence = 0.8;
    }
    
    // In a real implementation, we would use AI to analyze facial features,
    // image composition, and other characteristics
    
    return {
      isHuman,
      confidence,
      stockPhoto
    };
  } catch (error) {
    console.error('Error analyzing profile picture:', error);
    return { isHuman: false, confidence: 0, stockPhoto: false };
  } finally {
    // Clean up - delete the temporary file
    try {
      if (imagePath) {
        await fs.unlink(imagePath);
      }
    } catch (err) {
      console.error('Error deleting temporary file:', err);
    }
  }
}

async function analyzeProfile(url, platform) {
  let browser;
  console.log(`Starting analysis for URL: ${url} (${platform})`);
  
  try {
    // Launch browser with more detailed configuration
    console.log('Launching browser...');
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--remote-debugging-port=9222'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      dumpio: true // Enable verbose logging
    };
    
    console.log('Browser launch options:', JSON.stringify(launchOptions, null, 2));
    
    try {
      browser = await puppeteer.launch(launchOptions);
      console.log('Browser launched successfully');
    } catch (browserError) {
      console.error('Failed to launch browser:', browserError);
      throw new Error(`Failed to launch browser: ${browserError.message}`);
    }
    
    const page = await browser.newPage();
    
    // Set viewport and user agent to mimic a real browser
    await page.setViewport({ width: 1280, height: 800 });
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    await page.setUserAgent(userAgent);
    
    // Enable request/response logging
    page.on('request', request => {
      console.log('Request:', request.method(), request.url());
    });
    
    page.on('response', response => {
      console.log('Response:', response.status(), response.url());
    });
    
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });
    
    console.log(`Navigating to URL: ${url}`);
    let response;
    try {
      response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      console.log(`Page loaded with status: ${response?.status()}`);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-screenshot.png' });
      console.log('Screenshot saved to debug-screenshot.png');
      
    } catch (navError) {
      console.error('Navigation error:', navError);
      // Try to get page content to help with debugging
      const pageContent = await page.content().catch(e => `Failed to get page content: ${e.message}`);
      console.log('Page content length:', pageContent?.length || 0);
      throw new Error(`Failed to load page: ${navError.message}`);
    }
    
    // Wait for the page to load
    console.log('Waiting for page to fully load...');
    await page.waitForTimeout(5000);
    
    // Extract and analyze data based on the platform
    console.log(`Starting analysis for platform: ${platform}`);
    let analysisData;
    try {
      switch (platform.toLowerCase()) {
        case 'facebook':
          analysisData = await analyzeFacebookProfile(page);
          break;
        case 'instagram':
          analysisData = await analyzeInstagramProfile(page);
          break;
        case 'twitter':
          analysisData = await analyzeTwitterProfile(page);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
      console.log('Analysis data:', JSON.stringify(analysisData, null, 2));
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      throw new Error(`Failed to analyze profile: ${analysisError.message}`);
    }
    
    // Download and analyze profile picture if available
    if (analysisData.hasProfilePicture && analysisData.profilePictureUrl) {
      try {
        console.log('Downloading profile picture...');
        const imagePath = await downloadProfilePicture(
          analysisData.profilePictureUrl, 
          platform, 
          analysisData.username || 'unknown'
        );
        
        if (imagePath) {
          console.log('Analyzing profile picture...');
          analysisData.profilePictureAnalysis = await analyzeProfilePicture(imagePath);
          // Clean up the downloaded image
          await fs.unlink(imagePath).catch(e => 
            console.error('Failed to delete temporary image:', e)
          );
        }
      } catch (picError) {
        console.error('Error processing profile picture:', picError);
        analysisData.profilePictureAnalysis = { 
          error: 'Failed to process profile picture',
          details: picError.message 
        };
      }
    } else {
      console.log('No profile picture found');
      analysisData.profilePictureAnalysis = { 
        isHuman: false, 
        confidence: 0, 
        stockPhoto: false,
        error: 'No profile picture found'
      };
    }
    
    // Calculate fake score
    const { score, indicators } = calculateFakeScore(analysisData);
    
    return {
      url,
      platform,
      analysisData,
      score,
      indicators,
      isFake: score < 45,
      confidence: Math.abs(45 - score) * 2
    };
    
  } catch (error) {
    console.error('Error in analyzeProfile:', {
      message: error.message,
      stack: error.stack,
      url,
      platform
    });
    throw error;
  } finally {
    if (browser) {
      try {
        const pages = await browser.pages();
        console.log(`Closing browser with ${pages.length} pages`);
        await browser.close();
        console.log('Browser closed successfully');
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
}

/**
 * Analyzes a Facebook profile
 * @param {Page} page - Puppeteer page object
 * @returns {Object} Extracted profile data
 */
async function analyzeFacebookProfile(page) {
  try {
    // Check if we need to handle login popup
    const loginPopup = await page.$('.x9f619.x1n2onr6.x1ja2u2z');
    if (loginPopup) {
      // Try to close it or work around it
      const closeButtons = await page.$$('div[aria-label="Close"]');
      if (closeButtons.length > 0) {
        await closeButtons[0].click();
        await page.waitForTimeout(1000);
      }
    }

    // Extract profile data
    const data = {};
    
    // 1. Profile Picture
    const profilePicData = await page.evaluate(() => {
      const profilePic = document.querySelector('img[data-imgperflogname="profileCoverPhoto"]');
      return {
        hasProfilePicture: profilePic && !profilePic.src.includes('silhouette'),
        profilePictureUrl: profilePic ? profilePic.src : null
      };
    });
    
    data.hasProfilePicture = profilePicData.hasProfilePicture;
    data.profilePictureUrl = profilePicData.profilePictureUrl;
    
    // 2. Username/Handle
    data.username = await page.evaluate(() => {
      const nameElement = document.querySelector('h1');
      return nameElement ? nameElement.textContent.trim() : '';
    });
    
    // 3. Bio/About Info
    data.hasBio = await page.evaluate(() => {
      const bioElements = document.querySelectorAll('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql');
      return bioElements.length > 0;
    });
    
    // 6. Account Age Hint (try to find join date)
    data.joinDate = await page.evaluate(() => {
      const joinDateElements = Array.from(document.querySelectorAll('span'));
      const joinDateElement = joinDateElements.find(el => el.textContent.includes('Joined') || el.textContent.includes('Joined Facebook'));
      return joinDateElement ? joinDateElement.textContent.trim() : '';
    });
    
    // 7. Public Post Captions
    data.postCaptions = await page.evaluate(() => {
      const postElements = document.querySelectorAll('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql');
      const captions = [];
      postElements.forEach(post => {
        if (post.textContent.length > 10) {
          captions.push(post.textContent.trim());
        }
      });
      return captions.slice(0, 5); // Get up to 5 post captions
    });
    
    // 8. Visible Comments
    data.hasComments = await page.evaluate(() => {
      const commentElements = document.querySelectorAll('.ecm0bbzt.e5nlhep0.a8c37x1j');
      return commentElements.length > 0;
    });
    
    // 9. External Links in Bio
    data.hasExternalLinks = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a[href*="http"]');
      const bioLinks = Array.from(linkElements).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.includes('facebook.com');
      });
      return bioLinks.length > 0;
    });
    
    // Additional Facebook-specific checks
    data.friendCount = await page.evaluate(() => {
      const friendElements = document.querySelectorAll('a[href*="/friends"]');
      for (const el of friendElements) {
        const text = el.textContent.trim();
        if (text.includes('friends')) {
          const match = text.match(/(\d+)\s+friends/);
          return match ? parseInt(match[1], 10) : null;
        }
      }
      return null;
    });
    
    return data;
  } catch (error) {
    console.error('Error analyzing Facebook profile:', error);
    throw error;
  }
}

/**
 * Analyzes an Instagram profile
 * @param {Page} page - Puppeteer page object
 * @returns {Object} Extracted profile data
 */
async function analyzeInstagramProfile(page) {
  try {
    // Handle login popup if it appears
    const loginPopup = await page.$('div[role="dialog"]');
    if (loginPopup) {
      // Try to close it by clicking outside
      await page.mouse.click(10, 10);
      await page.waitForTimeout(1000);
    }

    // Extract profile data
    const data = {};
    
    // 1. Profile Picture
    const profilePicData = await page.evaluate(() => {
      const profilePic = document.querySelector('img[alt*="profile picture"]');
      return {
        hasProfilePicture: !!profilePic && !profilePic.src.includes('default'),
        profilePictureUrl: profilePic ? profilePic.src : null
      };
    });
    
    data.hasProfilePicture = profilePicData.hasProfilePicture;
    data.profilePictureUrl = profilePicData.profilePictureUrl;
    
    // 2. Username/Handle
    data.username = await page.evaluate(() => {
      const usernameElement = document.querySelector('h2');
      return usernameElement ? usernameElement.textContent.trim() : '';
    });
    
    // 3. Bio/About Info
    data.hasBio = await page.evaluate(() => {
      const bioElement = document.querySelector('h1');
      return bioElement && bioElement.textContent.trim().length > 0;
    });
    
    // 4. Post Count
    data.postCount = await page.evaluate(() => {
      const statsElements = document.querySelectorAll('span');
      for (const el of statsElements) {
        if (el.textContent.includes('posts')) {
          const match = el.textContent.match(/(\d+)\s+posts/);
          return match ? parseInt(match[1], 10) : 0;
        }
      }
      return 0;
    });
    
    // 5. Followers/Following Count
    const followStats = await page.evaluate(() => {
      const statsElements = document.querySelectorAll('li');
      let followers = 0;
      let following = 0;
      
      for (const el of statsElements) {
        const text = el.textContent.trim();
        if (text.includes('followers')) {
          const match = text.match(/(\d+(?:[.,]\d+)?)\s*followers/);
          followers = match ? parseFloat(match[1].replace(',', '')) : 0;
        } else if (text.includes('following')) {
          const match = text.match(/(\d+(?:[.,]\d+)?)\s*following/);
          following = match ? parseFloat(match[1].replace(',', '')) : 0;
        }
      }
      
      return { followers, following };
    });
    
    data.followers = followStats.followers;
    data.following = followStats.following;
    data.followRatio = followStats.followers > 0 ? followStats.following / followStats.followers : 0;
    
    // 7. Public Post Captions
    data.postCaptions = await page.evaluate(() => {
      const captionElements = document.querySelectorAll('div[class*="caption"]');
      const captions = [];
      captionElements.forEach(caption => {
        captions.push(caption.textContent.trim());
      });
      return captions.slice(0, 5); // Get up to 5 post captions
    });
    
    // 9. External Links in Bio
    data.hasExternalLinks = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a[href*="http"]');
      const bioLinks = Array.from(linkElements).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.includes('instagram.com');
      });
      return bioLinks.length > 0;
    });
    
    // 10. Tagged Content Visibility
    data.hasTaggedContent = await page.evaluate(() => {
      const taggedTab = document.querySelector('a[href*="/tagged"]');
      return !!taggedTab;
    });
    
    return data;
  } catch (error) {
    console.error('Error analyzing Instagram profile:', error);
    throw error;
  }
}

/**
 * Analyzes a Twitter profile
 * @param {Page} page - Puppeteer page object
 * @returns {Object} Extracted profile data
 */
async function analyzeTwitterProfile(page) {
  try {
    // Handle login popup if it appears
    const loginPopup = await page.$('div[aria-modal="true"]');
    if (loginPopup) {
      // Try to close it or work around it
      const closeButtons = await page.$$('div[aria-label="Close"]');
      if (closeButtons.length > 0) {
        await closeButtons[0].click();
        await page.waitForTimeout(1000);
      }
    }

    // Extract profile data
    const data = {};
    
    // 1. Profile Picture
    const profilePicData = await page.evaluate(() => {
      const profilePic = document.querySelector('img[alt="Profile image"]');
      return {
        hasProfilePicture: !!profilePic && !profilePic.src.includes('default_profile'),
        profilePictureUrl: profilePic ? profilePic.src : null
      };
    });
    
    data.hasProfilePicture = profilePicData.hasProfilePicture;
    data.profilePictureUrl = profilePicData.profilePictureUrl;
    
    // 2. Username/Handle
    data.username = await page.evaluate(() => {
      const nameElement = document.querySelector('div[data-testid="UserName"]');
      return nameElement ? nameElement.textContent.trim() : '';
    });
    
    // 3. Bio/About Info
    data.hasBio = await page.evaluate(() => {
      const bioElement = document.querySelector('div[data-testid="UserDescription"]');
      return !!bioElement && bioElement.textContent.trim().length > 0;
    });
    
    // 5. Followers/Following Count
    const followStats = await page.evaluate(() => {
      const statsElements = document.querySelectorAll('a[href*="/followers"], a[href*="/following"]');
      let followers = 0;
      let following = 0;
      
      for (const el of statsElements) {
        const text = el.textContent.trim();
        const href = el.getAttribute('href');
        
        if (href && href.includes('/followers')) {
          const match = text.match(/(\d+(?:[.,]\d+)?)\s*Followers/);
          followers = match ? parseFloat(match[1].replace(',', '')) : 0;
        } else if (href && href.includes('/following')) {
          const match = text.match(/(\d+(?:[.,]\d+)?)\s*Following/);
          following = match ? parseFloat(match[1].replace(',', '')) : 0;
        }
      }
      
      return { followers, following };
    });
    
    data.followers = followStats.followers;
    data.following = followStats.following;
    data.followRatio = followStats.followers > 0 ? followStats.following / followStats.followers : 0;
    
    // 6. Account Age Hint (join date)
    data.joinDate = await page.evaluate(() => {
      const joinDateElement = document.querySelector('span[data-testid="UserJoinDate"]');
      return joinDateElement ? joinDateElement.textContent.trim() : '';
    });
    
    // 7. Public Post Captions (tweets)
    data.postCaptions = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll('div[data-testid="tweetText"]');
      const tweets = [];
      tweetElements.forEach(tweet => {
        tweets.push(tweet.textContent.trim());
      });
      return tweets.slice(0, 5); // Get up to 5 tweets
    });
    
    // 9. External Links in Bio
    data.hasExternalLinks = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('a[href*="http"]');
      const bioLinks = Array.from(linkElements).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.includes('twitter.com') && !href.includes('x.com');
      });
      return bioLinks.length > 0;
    });
    
    return data;
  } catch (error) {
    console.error('Error analyzing Twitter profile:', error);
    throw error;
  }
}

/**
 * Calculates a fake score based on the analysis data
 * @param {Object} data - The analysis data
 * @returns {Object} Score and indicators
 */
function calculateFakeScore(data) {
  let score = 60; // Start with a slightly positive score for accounts with profiles
  const indicators = [];
  
  // 1. Profile Picture
  if (!data.hasProfilePicture) {
    score -= 15;
    indicators.push({
      factor: 'Profile Picture',
      issue: 'No profile picture or default image',
      impact: 'high'
    });
  } else {
    // Check if the profile picture is of a real human
    if (data.profilePictureAnalysis && data.profilePictureAnalysis.isHuman) {
      // Bonus for having a human profile picture
      score += 10;
      indicators.push({
        factor: 'Profile Picture',
        issue: 'Profile has a human photo',
        impact: 'positive'
      });
    } else if (data.profilePictureAnalysis && data.profilePictureAnalysis.stockPhoto) {
      // Penalty for using a stock photo
      score -= 10;
      indicators.push({
        factor: 'Profile Picture',
        issue: 'Profile uses a stock photo',
        impact: 'medium'
      });
    } else {
      // Smaller bonus for having any profile picture
      score += 5;
      indicators.push({
        factor: 'Profile Picture',
        issue: 'Profile has a picture',
        impact: 'positive'
      });
    }
  }
  
  // 2. Username/Handle
  if (data.username) {
    // Check for suspicious patterns in username
    const hasRandomNumbers = /[a-zA-Z]+[0-9]{4,}/.test(data.username);
    const hasExcessiveUnderscores = (data.username.match(/_/g) || []).length > 2;
    const hasGenericName = /official|real|original|authentic|\d{6,}/.test(data.username.toLowerCase());
    
    if (hasRandomNumbers || hasExcessiveUnderscores || hasGenericName) {
      score -= 10;
      indicators.push({
        factor: 'Username',
        issue: 'Suspicious username pattern',
        impact: 'medium'
      });
    }
  }
  
  // 3. Bio/About Info
  if (!data.hasBio) {
    score -= 5;
    indicators.push({
      factor: 'Bio',
      issue: 'Missing bio information',
      impact: 'low'
    });
  } else {
    // Bonus for having a bio
    score += 5;
    indicators.push({
      factor: 'Bio',
      issue: 'Profile has bio information',
      impact: 'positive'
    });
  }
  
  // 4. Post Count (Instagram)
  if ('postCount' in data && data.postCount < 3) {
    score -= 10;
    indicators.push({
      factor: 'Post Count',
      issue: 'Very few posts',
      impact: 'medium'
    });
  }
  
  // 5. Followers/Following Ratio
  if ('followRatio' in data) {
    if (data.followers < 10 && data.following > 100) {
      score -= 15;
      indicators.push({
        factor: 'Follow Ratio',
        issue: 'Low followers but following many accounts',
        impact: 'high'
      });
    } else if (data.followRatio > 10) {
      score -= 10;
      indicators.push({
        factor: 'Follow Ratio',
        issue: 'Suspicious follower/following ratio',
        impact: 'medium'
      });
    }
  }
  
  // 6. Account Age
  if (data.joinDate) {
    const joinDateMatch = data.joinDate.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/);
    if (joinDateMatch) {
      const joinYear = parseInt(joinDateMatch[2], 10);
      const currentYear = new Date().getFullYear();
      
      if (currentYear - joinYear < 1) {
        score -= 10;
        indicators.push({
          factor: 'Account Age',
          issue: 'Recently created account',
          impact: 'medium'
        });
      } else {
        score += 5; // Bonus for older accounts
      }
    }
  }
  
  // 7. Post Captions
  if (data.postCaptions && data.postCaptions.length > 0) {
    // Bonus for having posts
    score += 5;
    indicators.push({
      factor: 'Post Content',
      issue: 'Profile has visible posts',
      impact: 'positive'
    });
    
    // Check for repetitive content or spam patterns
    const hasRepetitiveContent = data.postCaptions.some(caption => {
      const hashtagCount = (caption.match(/#/g) || []).length;
      const emojiCount = (caption.match(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/gu) || []).length;
      
      return hashtagCount > 15 || emojiCount > 10;
    });
    
    if (hasRepetitiveContent) {
      score -= 5;
      indicators.push({
        factor: 'Post Content',
        issue: 'Excessive hashtags or emojis',
        impact: 'low'
      });
    }
  } else if ('postCaptions' in data) {
    score -= 5;
    indicators.push({
      factor: 'Post Content',
      issue: 'No visible posts',
      impact: 'low'
    });
  }
  
  // 9. External Links
  if (data.hasExternalLinks) {
    // This could be legitimate or suspicious depending on context
    // We'll consider it neutral for now
  }
  
  // 10. Tagged Content (Instagram)
  if ('hasTaggedContent' in data && !data.hasTaggedContent) {
    score -= 5;
    indicators.push({
      factor: 'Tagged Content',
      issue: 'No tagged content',
      impact: 'low'
    });
  }
  
  // Additional platform-specific checks
  if ('friendCount' in data) {
    // Facebook-specific: friend count
    if (data.friendCount !== null && data.friendCount < 10) {
      score -= 10;
      indicators.push({
        factor: 'Friend Count',
        issue: 'Very few friends',
        impact: 'medium'
      });
    }
  }
  
  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return { score, indicators };
}

module.exports = { analyzeProfile, downloadProfilePicture, analyzeProfilePicture };