# 🚀 Deployment Guide

This guide will help you deploy your Fake Account Detector application to Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- GitHub account with your repository
- Render account (free tier available)
- Vercel account (free tier available)
- Node.js 16+ and npm installed locally

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. **Ensure all files are committed and pushed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin master
   ```

2. **Verify these files exist in your repository:**
   - `render.yaml` (Render configuration)
   - `server.prod.js` (Production server)
   - `package.json` (with proper scripts)
   - `env.example` (environment variables template)

### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - **Name:** `fake-account-detector-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

   **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

5. **Click "Create Web Service"**
6. **Wait for deployment to complete**
7. **Note your backend URL:** `https://your-app-name.onrender.com`

### Step 3: Test Backend

1. **Test health check:** `https://your-app-name.onrender.com/api/health`
2. **Test API info:** `https://your-app-name.onrender.com/api`

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update the backend URL in your frontend configuration**
   - Edit `client/vercel.json`
   - Replace `https://your-backend-domain.onrender.com` with your actual Render URL

2. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Update backend URL for deployment"
   git push origin master
   ```

### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**

   **Framework Preset:** `Create React App`
   **Root Directory:** `client`
   **Build Command:** `npm run build`
   **Output Directory:** `build`
   **Install Command:** `npm install`

   **Environment Variables:**
   ```
   REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

5. **Click "Deploy"**
6. **Wait for deployment to complete**
7. **Note your frontend URL:** `https://your-app-name.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Render Dashboard**
2. **Edit your web service**
3. **Update environment variable:**
   ```
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```
4. **Redeploy the service**

## 🔗 Connect Frontend and Backend

### Update Frontend Configuration

1. **In your Vercel project settings, add environment variable:**
   ```
   REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

2. **Redeploy frontend with new environment variable**

### Test the Connection

1. **Open your Vercel frontend URL**
2. **Try analyzing a profile**
3. **Check browser console for any errors**
4. **Verify API calls are going to your Render backend**

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in Render matches your Vercel domain exactly
   - Check that the environment variable is set correctly

2. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check build logs for specific errors

3. **API Timeouts**
   - Render free tier has limitations
   - Consider upgrading to paid plan for better performance
   - Implement proper error handling for timeouts

4. **Puppeteer Issues**
   - Render may have restrictions on browser automation
   - Consider using alternative approaches for production

### Debugging

1. **Check Render logs:** Dashboard → Your Service → Logs
2. **Check Vercel logs:** Dashboard → Your Project → Functions → Logs
3. **Test API endpoints directly:** Use Postman or curl
4. **Check browser console:** For frontend errors

## 📊 Monitoring

### Render Monitoring
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory usage
- **Health Checks:** Automatic health monitoring

### Vercel Monitoring
- **Analytics:** Page views, performance
- **Functions:** API call logs
- **Deployments:** Build and deployment history

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:
- **Push to master branch** → Automatic deployment
- **Preview deployments** for pull requests
- **Rollback** to previous versions if needed

## 💰 Cost Optimization

### Render Free Tier
- **Limits:** 750 hours/month
- **Sleep:** Services sleep after 15 minutes of inactivity
- **Cold starts:** First request after sleep may be slow

### Vercel Free Tier
- **Bandwidth:** 100GB/month
- **Build minutes:** 6000 minutes/month
- **Functions:** 100GB-hours/month

## 🎯 Next Steps

1. **Set up custom domains** (optional)
2. **Configure monitoring and alerts**
3. **Set up CI/CD pipelines**
4. **Implement caching strategies**
5. **Add security headers and HTTPS**

## 📞 Support

- **Render Support:** [docs.render.com](https://docs.render.com/)
- **Vercel Support:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues:** For application-specific problems

---

**Note:** This deployment setup is optimized for the free tiers of both platforms. For production use, consider upgrading to paid plans for better performance and reliability. 