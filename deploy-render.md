# 🚀 Deploy GeoTaste to Render - Step by Step

## 🎯 Quick Start (5 minutes)

### Step 1: Go to Render
1. Open [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click the "New +" button
2. Select "Web Service"
3. Click "Connect a repository"
4. Find and select your GeoTaste repository

### Step 3: Configure Settings
Fill in these exact settings:

**Name:** `geotaste`

**Environment:** `Python 3`

**Region:** Choose closest to you (US East, US West, etc.)

**Branch:** `main` (or your default branch)

**Root Directory:** Leave empty

**Build Command:**
```bash
pip install -r Backend/requirements.txt && npm install && npm run build && mkdir -p Backend/static && cp -r dist/* Backend/static/
```

**Start Command:**
```bash
cd Backend && python app.py
```

### Step 4: Add Environment Variables
Click "Environment" tab and add these:

| Name | Value |
|------|-------|
| `QLOO_API_KEY` | `rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0` |
| `OPENAI_API_KEY` | `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` |
| `MAPBOX_ACCESS_TOKEN` | `pk.eyJ1IjoiZ203MTciLCJhIjoiY21kY3k1amNtMDJkdjJqc2M4cTdkZnJ3ZyJ9.aOfW29U47FH0vS9X8lfxLQ` |

### Step 5: Deploy!
1. Click "Create Web Service"
2. Wait 5-10 minutes for build
3. Your app will be live at: `https://geotaste.onrender.com`

## 🎉 Done!

Your GeoTaste app is now live and anyone can use it!

## 🔧 If Something Goes Wrong

### Build Fails?
- Check build logs in Render dashboard
- Make sure all files are committed to GitHub
- Verify `render.yaml` is in your repo root

### App Won't Start?
- Check deployment logs
- Verify environment variables are set
- Test locally first: `cd Backend && python app.py`

### API Errors?
- Double-check API keys are correct
- Make sure keys have proper permissions
- Check API rate limits

## 📊 What You Get

- ✅ **Free hosting** (750 hours/month)
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificate** (https://)
- ✅ **Custom domain** (optional)
- ✅ **Logs and monitoring**

---

**Your business intelligence platform is now live! 🚀** 