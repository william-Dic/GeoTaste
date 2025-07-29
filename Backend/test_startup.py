#!/usr/bin/env python3
"""
Test script to verify Flask app startup
"""
import os
import sys
import time
import requests
from app import app

def test_app_startup():
    """Test that the app starts and responds to health check"""
    print("🧪 Testing Flask app startup...")
    
    # Test health check endpoint
    with app.test_client() as client:
        print("📡 Testing /api/health endpoint...")
        response = client.get('/api/health')
        print(f"✅ Health check response: {response.status_code}")
        print(f"📄 Response data: {response.get_json()}")
        
        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print("❌ Health check failed!")
            return False

if __name__ == '__main__':
    success = test_app_startup()
    sys.exit(0 if success else 1) 