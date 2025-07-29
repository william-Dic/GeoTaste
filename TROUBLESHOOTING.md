# 🔧 GeoTaste Deployment Troubleshooting

## 🚨 Common Issues & Solutions

### Issue 1: setuptools.build_meta Error

**Error:** `Cannot import 'setuptools.build_meta'`

**Solution:** 
1. Use the minimal requirements file: `Backend/requirements-minimal.txt`
2. Updated `render.yaml` to use minimal dependencies
3. If still failing, try these steps in Render dashboard:

**Manual Fix in Render:**
1. Go to your service in Render dashboard
2. Click "Environment" tab
3. Add this environment variable:
   - **Name:** `PIP_NO_BUILD_ISOLATION`
   - **Value:** `false`
4. Redeploy the service

### Issue 2: Python Version Conflicts

**Error:** Python version not compatible

**Solution:**
1. Check `Backend/runtime.txt` has `python-3.11.7`
2. In Render dashboard, ensure Python 3.11 is selected
3. If needed, manually set Python version in service settings

### Issue 3: Build Command Fails

**Error:** Build command execution failed

**Solution:**
1. Check the build logs in Render dashboard
2. Verify all files are committed to GitHub
3. Try this alternative build command:

```bash
pip install --upgrade pip setuptools wheel
pip install -r Backend/requirements-minimal.txt
npm install
npm run build
mkdir -p Backend/static
cp -r dist/* Backend/static/
```

### Issue 4: Environment Variables Not Set

**Error:** API calls failing

**Solution:**
1. Go to Render dashboard → Your service → Environment
2. Add these variables:
   - `QLOO_API_KEY`
   - `OPENAI_API_KEY`
   - `MAPBOX_ACCESS_TOKEN`
3. Redeploy after adding variables

### Issue 5: Frontend Not Loading

**Error:** White screen or 404 errors

**Solution:**
1. Check if `Backend/static/index.html` exists
2. Verify build command copied files correctly
3. Check Flask app is serving static files

## 🔄 Alternative Deployment Methods

### Method 1: Manual Render Setup
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Use these settings:
   - **Environment:** Python 3
   - **Build Command:** 
     ```bash
     pip install -r Backend/requirements-minimal.txt && npm install && npm run build && mkdir -p Backend/static && cp -r dist/* Backend/static/
     ```
   - **Start Command:** `cd Backend && python app.py`

### Method 2: Vercel + Render Split
**Frontend on Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Vercel will auto-detect React app
4. Set environment variable: `VITE_API_URL=https://your-render-backend.onrender.com`

**Backend on Render:**
1. Deploy only the Backend folder to Render
2. Use `Backend/requirements-minimal.txt`
3. Start command: `python app.py`

### Method 3: Local Testing First
```bash
# Test locally before deploying
npm run build
mkdir -p Backend/static
cp -r dist/* Backend/static/
cd Backend
python app.py
```

## 📞 Getting Help

1. **Check Render Logs:** Always check the build and deployment logs first
2. **Test Locally:** Make sure everything works locally before deploying
3. **Render Support:** [community.render.com](https://community.render.com)
4. **GitHub Issues:** Check if others have similar issues

## 🎯 Quick Fix Checklist

- [ ] Use `requirements-minimal.txt` instead of `requirements.txt`
- [ ] Check Python version is 3.11.7
- [ ] Verify all environment variables are set
- [ ] Test build command locally first
- [ ] Check Render logs for specific error messages

---

**Most issues can be resolved by using the minimal requirements file! 🚀** 