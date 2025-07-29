#!/bin/bash

echo "========================================"
echo "   GeoTaste Deployment Script"
echo "========================================"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "🚀 Starting GeoTaste deployment process..."
echo

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"
echo

# Copy frontend build to backend for serving
echo "📁 Copying frontend build to backend..."
if [ -d "Backend/static" ]; then
    rm -rf Backend/static
fi
mkdir -p Backend/static
cp -r dist/* Backend/static/

echo "✅ Frontend files copied to backend!"
echo

echo "🎉 Deployment preparation complete!"
echo
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Railway/Render"
echo "3. Set up environment variables:"
echo "   - QLOO_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - MAPBOX_ACCESS_TOKEN"
echo
echo "Your GeoTaste application will be live at the provided URL!" 