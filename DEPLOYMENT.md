# 🚀 GeoTaste Deployment Guide

This guide will help you deploy GeoTaste to the cloud so others can use your business intelligence platform.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account** - To host your code
2. **API Keys Ready**:
   - Qloo API Key
   - OpenAI API Key  
   - Mapbox Access Token
3. **Cloud Platform Account** (choose one):
   - Railway (Recommended - Free tier available)
   - Render (Free tier available)
   - Heroku (Paid)

## 🎯 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway is perfect for full-stack applications like GeoTaste.

#### Step 1: Prepare Your Code
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your GeoTaste repository
5. Railway will automatically detect it's a Python app

#### Step 3: Configure Environment Variables
In your Railway project dashboard, add these environment variables:

```
QLOO_API_KEY=your_qloo_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

#### Step 4: Deploy
Railway will automatically build and deploy your app. You'll get a URL like:
`https://geotaste-production.up.railway.app`

### Option 2: Render

#### Step 1: Prepare for Render
Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: geotaste
    env: python
    buildCommand: pip install -r Backend/requirements.txt && npm install && npm run build && cp -r dist/* Backend/static/
    startCommand: cd Backend && python app.py
    envVars:
      - key: QLOO_API_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: MAPBOX_ACCESS_TOKEN
        sync: false
```

#### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up and connect your GitHub
3. Click "New Web Service"
4. Select your repository
5. Configure environment variables
6. Deploy!

### Option 3: Heroku

#### Step 1: Prepare for Heroku
```bash
# Install Heroku CLI
# Create Procfile in root directory
echo "web: cd Backend && python app.py" > Procfile

# Create app.json
cat > app.json << EOF
{
  "name": "geotaste",
  "description": "Business Intelligence Platform powered by Qloo API",
  "repository": "https://github.com/yourusername/geotaste",
  "keywords": ["python", "flask", "react", "business-intelligence"],
  "env": {
    "QLOO_API_KEY": {
      "description": "Your Qloo API key",
      "required": true
    },
    "OPENAI_API_KEY": {
      "description": "Your OpenAI API key", 
      "required": true
    },
    "MAPBOX_ACCESS_TOKEN": {
      "description": "Your Mapbox access token",
      "required": true
    }
  },
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    },
    {
      "url": "heroku/python"
    }
  ]
}
EOF
```

#### Step 2: Deploy to Heroku
```bash
# Install Heroku CLI first
heroku create geotaste-app
heroku config:set QLOO_API_KEY=your_key_here
heroku config:set OPENAI_API_KEY=your_key_here  
heroku config:set MAPBOX_ACCESS_TOKEN=your_token_here
git push heroku main
```

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
Most platforms provide free SSL certificates. To add a custom domain:

1. **Railway**: Go to Settings → Domains
2. **Render**: Go to Settings → Custom Domains  
3. **Heroku**: `heroku domains:add yourdomain.com`

### SSL Certificate
All platforms provide free SSL certificates automatically.

## 📊 Monitoring & Logs

### Railway
- View logs in the Railway dashboard
- Set up alerts for errors
- Monitor resource usage

### Render  
- Logs available in dashboard
- Automatic restarts on crashes
- Performance monitoring

### Heroku
```bash
heroku logs --tail
heroku ps
```

## 🔄 Continuous Deployment

All platforms support automatic deployments:

1. **Railway**: Automatic on git push
2. **Render**: Automatic on git push  
3. **Heroku**: Automatic on git push to heroku remote

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Python version compatibility
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
curl https://your-app-url.railway.app/api/health

# Check environment variables
echo $QLOO_API_KEY
echo $OPENAI_API_KEY
echo $MAPBOX_ACCESS_TOKEN

# View logs
# Use platform-specific log viewing commands
```

## 📈 Scaling

### Railway
- Automatic scaling based on traffic
- Upgrade to paid plan for more resources

### Render
- Free tier: 750 hours/month
- Paid plans for more resources

### Heroku
- Free tier discontinued
- Paid plans start at $7/month

## 🎉 Success!

Once deployed, your GeoTaste application will be available at:
- **Railway**: `https://your-app-name.up.railway.app`
- **Render**: `https://your-app-name.onrender.com`  
- **Heroku**: `https://your-app-name.herokuapp.com`

Share your URL with others to let them explore business intelligence powered by Qloo API!

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check your application logs
4. Verify all environment variables are set correctly

---

**Happy Deploying! 🚀** 