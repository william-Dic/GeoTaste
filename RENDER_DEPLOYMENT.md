# 🚀 Deploy GeoTaste to Render (Free Tier)

Since Railway's free tier is limited to databases, let's deploy to **Render** which offers a generous free tier for web applications!

## ✅ Prerequisites (Already Done!)

- ✅ Code uploaded to GitHub
- ✅ All configuration files created
- ✅ Build tested locally

## 🎯 Quick Deployment Steps

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"

### Step 2: Connect Your Repository
1. Click "Connect a repository"
2. Select your GeoTaste repository
3. Render will automatically detect it's a Python app

### Step 3: Configure Your Service
Use these settings:

**Basic Settings:**
- **Name**: `geotaste` (or any name you prefer)
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (root of repo)

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

## 📊 Render Free Tier Benefits

- ✅ **750 hours/month** - Plenty for personal projects
- ✅ **Automatic deployments** from GitHub
- ✅ **Free SSL certificates**
- ✅ **Custom domains** (optional)
- ✅ **Logs and monitoring**

## 🔧 Troubleshooting

### If Build Fails:
1. Check the build logs in Render dashboard
2. Verify all dependencies are in `Backend/requirements.txt`
3. Make sure `render.yaml` is in your repository root

### If App Doesn't Start:
1. Check the deployment logs
2. Verify environment variables are set correctly
3. Test locally first: `cd Backend && python app.py`

### Common Issues:
- **Port issues**: App uses `PORT` environment variable (Render sets this automatically)
- **CORS issues**: Already configured for all origins
- **API key issues**: Double-check environment variables

## 🚀 Alternative: Vercel (Frontend Only)

If you want to separate frontend and backend:

### Frontend on Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Vercel will auto-detect it's a React app
4. Set environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`

### Backend on Render:
Deploy only the Backend folder to Render as a separate service.

## 📞 Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **Check logs**: Available in your Render dashboard

---

**Your GeoTaste app will be live in minutes! 🎉** 