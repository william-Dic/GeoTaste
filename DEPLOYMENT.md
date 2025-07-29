# 🚀 GeoTaste Deployment Guide

This guide will help you deploy GeoTaste to the cloud so others can use your business intelligence platform.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account** - To host your code ✅ (Already done!)
2. **API Keys Ready**:
   - Qloo API Key
   - OpenAI API Key  
   - Mapbox Access Token
3. **Cloud Platform Account**: Render (Free tier available)

## 🎯 Recommended: Render Deployment

**Render** is the best option for GeoTaste because:
- ✅ **Generous free tier** (750 hours/month)
- ✅ **Perfect for full-stack apps** like GeoTaste
- ✅ **Automatic deployments** from GitHub
- ✅ **Free SSL certificates**
- ✅ **Easy environment variable management**

## 🚀 Quick Deployment to Render

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"

### Step 2: Connect Your Repository
1. Click "Connect a repository"
2. Select your GeoTaste repository
3. Render will automatically detect it's a Python app

### Step 3: Configure Your Service
Use these exact settings:

**Basic Settings:**
- **Name**: `geotaste`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty

**Build & Deploy:**
- **Build Command**: 
  ```bash
  pip install -r Backend/requirements.txt && npm install && npm run build && mkdir -p Backend/static && cp -r dist/* Backend/static/
  ```
- **Start Command**: 
  ```bash
  cd Backend && python app.py
  ```

### Step 4: Add Environment Variables
Click "Environment" tab and add these variables:

| Variable Name | Value |
|---------------|-------|
| `QLOO_API_KEY` | Your Qloo API key |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `MAPBOX_ACCESS_TOKEN` | Your Mapbox access token |

### Step 5: Deploy!
1. Click "Create Web Service"
2. Render will start building and deploying your app
3. Wait 5-10 minutes for the first deployment

## 🎉 Success!

Your app will be available at:
**https://geotaste.onrender.com** (or similar URL)

## 🔧 Local Testing Before Deployment

Test your deployment setup locally:

```bash
# Build frontend
npm run build

# Copy to backend
mkdir -p Backend/static
cp -r dist/* Backend/static/

# Test backend
cd Backend
python app.py
```

Visit `http://localhost:5000` to test.

## 🌐 Domain & SSL

### Custom Domain (Optional)
Render provides free SSL certificates. To add a custom domain:

1. Go to your service settings in Render
2. Click "Custom Domains"
3. Add your domain and follow the DNS instructions

### SSL Certificate
Render provides free SSL certificates automatically.

## 📊 Monitoring & Logs

### Render
- View logs in the Render dashboard
- Automatic restarts on crashes
- Performance monitoring
- Health checks

## 🔄 Continuous Deployment

Render supports automatic deployments:
- Automatic deployment on git push to main branch
- Manual deployment option available
- Rollback to previous versions

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check the build logs in Render dashboard
   - Verify all dependencies in requirements.txt
   - Check for missing environment variables

2. **API Errors**
   - Verify API keys are set correctly
   - Check API rate limits
   - Ensure CORS is configured properly

3. **Frontend Not Loading**
   - Verify static files are copied to Backend/static
   - Check if index.html exists in static folder
   - Ensure Flask is serving static files correctly

### Debug Commands

```bash
# Check if backend is running
curl https://your-app-name.onrender.com/api/health

# Check environment variables
# Use Render dashboard to verify environment variables

# View logs
# Available in your Render dashboard
```

## 📈 Scaling

### Render Free Tier
- **750 hours/month** - Plenty for personal projects
- **Automatic scaling** based on traffic
- **Paid plans** available for more resources

## 🎉 Success!

Once deployed, your GeoTaste application will be available at:
**https://your-app-name.onrender.com**

Share your URL with others to let them explore business intelligence powered by Qloo API!

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review [Render documentation](https://docs.render.com)
3. Check your application logs in Render dashboard
4. Verify all environment variables are set correctly

## 🚀 Alternative: Vercel + Render (Advanced)

If you want to separate frontend and backend:

### Frontend on Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Vercel will auto-detect it's a React app
4. Set environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`

### Backend on Render:
Deploy only the Backend folder to Render as a separate service.

---

**Happy Deploying! 🚀** 