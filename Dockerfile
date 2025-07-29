# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy Python requirements
COPY Backend/requirements-production.txt ./Backend/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r Backend/requirements-production.txt

# Copy the rest of the application
COPY . .

# Build the React frontend
RUN npm run build

# Create static directory and copy built files
RUN mkdir -p Backend/static && \
    cp -r dist/* Backend/static/

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Create a startup script with better error handling
RUN echo '#!/bin/bash\n\
echo "🚀 Starting GeoTaste application..."\n\
echo "📁 Current directory: $(pwd)"\n\
echo "📁 Backend directory contents:"\n\
ls -la /app/Backend/\n\
echo "🐍 Python version:"\n\
python --version\n\
echo "📦 Installed packages:"\n\
pip list | grep -E "(flask|openai|requests|pandas|numpy|plotly|matplotlib|seaborn)"\n\
echo "🔧 Environment variables:"\n\
echo "PORT: $PORT"\n\
echo "FLASK_APP: $FLASK_APP"\n\
echo "FLASK_ENV: $FLASK_ENV"\n\
echo "🌐 Starting Flask app..."\n\
cd /app/Backend && python app.py\n\
' > /app/start.sh && chmod +x /app/start.sh

# Use the startup script
CMD ["/app/start.sh"] 