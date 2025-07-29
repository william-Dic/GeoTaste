# 🚀 Railway Deployment Guide for GeoTaste

## ✅ You've Got Railway! Let's Deploy

### Step 1: Connect Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `GeoTaste` repository

### Step 2: Configure Environment Variables
In Railway dashboard → Variables tab, add:

```
QLOO_API_KEY=your_qloo_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### Step 3: Deploy Settings
Railway will auto-detect:
- **Build Command:** `pip install -r Backend/requirements-production.txt && npm install && npm run build && mkdir -p Backend/static && cp -r dist/* Backend/static/`
- **Start Command:** `cd Backend && python app.py`
- **Port:** Auto-detected from Flask

### Step 4: Deploy
1. Click "Deploy" 
2. Wait for build to complete (2-3 minutes)
3. Get your live URL!

## 🎯 What Happens During Deployment

### Build Process:
1. **Install Python dependencies** (Flask, matplotlib, etc.)
2. **Install Node.js dependencies** (React, Material-UI, etc.)
3. **Build React frontend** (creates `dist/` folder)
4. **Copy frontend to backend** (creates `Backend/static/`)
5. **Start Flask server**

### Expected Timeline:
- **Build:** 2-3 minutes
- **Deploy:** 1-2 minutes
- **Total:** ~5 minutes

## 🔍 Troubleshooting

### If Build Fails:
1. Check Railway logs for specific errors
2. Verify all environment variables are set
3. Make sure `requirements-production.txt` exists
4. Check that `railway.json` is in root directory

### Common Issues:
- **Missing API keys:** Set all environment variables
- **Python version:** Railway uses Python 3.11 (compatible)
- **Port issues:** Railway auto-detects port from Flask

## 🎉 After Deployment

### Your App Will Be Available At:
- **Railway URL:** `https://your-app-name.railway.app`
- **Always responsive** - no cold start delays!
- **Professional appearance**

### Next Steps:
1. **Test the application** - try searching for a location
2. **Add custom domain** (optional) in Railway dashboard
3. **Monitor performance** in Railway dashboard
4. **Share your URL** with others!

## 🚀 Railway Benefits You Now Have

✅ **No cold start delays** - instant response  
✅ **Professional hosting** - reliable performance  
✅ **Automatic deployments** - push to GitHub = auto-deploy  
✅ **SSL certificate** - secure HTTPS  
✅ **Custom domains** - professional branding  
✅ **Monitoring & logs** - easy debugging  

## 📞 Need Help?

- **Railway logs:** Check deployment logs in dashboard
- **Railway docs:** [docs.railway.app](https://docs.railway.app)
- **Railway community:** [community.railway.app](https://community.railway.app)

---

**Your GeoTaste AI Agentic Business Environment Consultant is ready to go live! 🎉** 