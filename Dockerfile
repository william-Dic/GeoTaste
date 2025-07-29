# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
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

# Expose port
EXPOSE 5000

# Change to backend directory and start the application
WORKDIR /app/Backend
CMD ["python", "app.py"] 