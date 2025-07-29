# 🚀 Quick Deploy GeoTaste to Render

## ✅ You're Ready!

Since you've already uploaded everything to GitHub, you're just 5 minutes away from having your GeoTaste app live!

## 🎯 Exact Steps to Deploy

### 1. Go to Render
- Visit [render.com](https://render.com)
- Sign up with your GitHub account

### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect your GeoTaste repository

### 3. Configure Settings
**Name:** `geotaste`
**Environment:** `Python 3`
**Region:** Choose closest to you
**Branch:** `main`

**Build Command:**
```bash
pip install -r Backend/requirements.txt && npm install && npm run build && mkdir -p Backend/static && cp -r dist/* Backend/static/
```

**Start Command:**
```bash
cd Backend && python app.py
```

### 4. Add Environment Variables
Click "Environment" tab and add:

| Name | Value |
|------|-------|
| `QLOO_API_KEY` | `rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0` |
| `OPENAI_API_KEY` | `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` |
| `MAPBOX_ACCESS_TOKEN` | `pk.eyJ1IjoiZ203MTciLCJhIjoiY21kY3k1amNtMDJkdjJqc2M4cTdkZnJ3ZyJ9.aOfW29U47FH0vS9X8lfxLQ` |

### 5. Deploy!
- Click "Create Web Service"
- Wait 5-10 minutes
- Your app will be live at: `https://geotaste.onrender.com`

## 🎉 Done!

Your GeoTaste business intelligence platform is now live and anyone can use it!

## 📊 What You Get

- ✅ **Free hosting** (750 hours/month)
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificate** (https://)
- ✅ **Professional URL** to share with others

## 🌐 Share Your App

Once deployed, share your URL with others so they can:
- Search any city in the world
- Get business intelligence powered by Qloo API
- View interactive visualizations
- Chat with AI about business insights

---

**Your business intelligence platform is ready to go live! 🚀** 