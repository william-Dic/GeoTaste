import matplotlib
matplotlib.use('Agg')
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
import uuid
from visualizations import QlooVisualizer
import io
import matplotlib.pyplot as plt
import seaborn as sns

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/visualizations', methods=['POST'])
def generate_visualizations():
    # Generate unique request ID for tracking
    request_id = str(uuid.uuid4())[:8]
    
    try:
        data = request.get_json()
        city = data.get('city')
        country = data.get('country')
        limit = data.get('limit', 20)
        print(f"[{request_id}] 🔍 NEW REQUEST - City: {city}, Country: {country}, Limit: {limit}")
        
        # Create a FRESH instance for each request to prevent caching issues
        visualizer = QlooVisualizer()
        print(f"[{request_id}] ✅ Created fresh QlooVisualizer instance")
        
        # Fetch Qloo API data ONCE
        print(f"[{request_id}] 📡 Fetching brands data for {city}, {country}...")
        from qloo_analysis import get_brands
        raw_brands = get_brands(city, country, limit)
        
        # Debug: Check brands data content
        if raw_brands and 'results' in raw_brands and 'entities' in raw_brands['results']:
            brand_names = [brand.get('name', 'Unknown') for brand in raw_brands['results']['entities'][:3]]
            print(f"[{request_id}] 📊 Brands data received: {len(raw_brands['results']['entities'])} brands")
            print(f"[{request_id}] 📊 First 3 brands: {brand_names}")
        else:
            print(f"[{request_id}] ⚠️ No valid brands data received")
        
        print(f"[{request_id}] 📡 Fetching places data for {city}, {country}...")
        from qloo_analysis import get_places
        raw_places = get_places(city, country, limit)
        
        # Debug: Check places data content
        if raw_places and 'results' in raw_places and 'entities' in raw_places['results']:
            place_names = [place.get('name', 'Unknown') for place in raw_places['results']['entities'][:3]]
            print(f"[{request_id}] 🏢 Places data received: {len(raw_places['results']['entities'])} places")
            print(f"[{request_id}] 🏢 First 3 places: {place_names}")
        else:
            print(f"[{request_id}] ⚠️ No valid places data received")
        
        # Set the pre-fetched data in the visualizer
        print(f"[{request_id}] 🔄 Setting data in visualizer...")
        visualizer.set_data(raw_brands, raw_places)
        
        # Now generate all visualizations using the pre-fetched data
        print(f"[{request_id}] 🎨 Generating visualizations...")
        viz_data = visualizer.generate_all_visualizations(city, country, limit)
        print(f"[{request_id}] ✅ Generated visualizations for {city}, {country}")
        
        # Debug: Check what visualizations were generated
        viz_keys = list(viz_data.keys()) if viz_data else []
        print(f"[{request_id}] 📈 Generated visualizations: {viz_keys}")
        
        return jsonify(viz_data)
    except Exception as e:
        print(f"[{request_id}] ❌ Exception: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/visualizations/place_ratings_image', methods=['POST'])
def place_ratings_image():
    data = request.get_json()
    city = data.get('city')
    country = data.get('country')
    limit = data.get('limit', 20)
    visualizer = QlooVisualizer()
    from qloo_analysis import get_brands, get_places
    raw_brands = get_brands(city, country, limit)
    raw_places = get_places(city, country, limit)
    visualizer.set_data(raw_brands, raw_places)
    ratings = []
    if visualizer.places_data and 'results' in visualizer.places_data and 'entities' in visualizer.places_data['results']:
        for place in visualizer.places_data['results']['entities']:
            properties = place.get('properties', {})
            rating = properties.get('business_rating')
            if rating and rating != 'N/A':
                try:
                    ratings.append(float(rating))
                except (ValueError, TypeError):
                    continue
    if not ratings:
        # Return a blank image with a message
        plt.figure(figsize=(6, 4))
        plt.text(0.5, 0.5, 'No ratings data available', ha='center', va='center', fontsize=16)
        plt.axis('off')
    else:
        plt.figure(figsize=(6, 4))
        sns.histplot(ratings, bins=10, kde=True, color='#4ECDC4')
        plt.title(f'Place Ratings Distribution in {city}')
        plt.xlabel('Rating')
        plt.ylabel('Number of Places')
        plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

@app.route('/api/visualizations/place_ratings_data', methods=['POST'])
def place_ratings_data():
    data = request.get_json()
    city = data.get('city')
    country = data.get('country')
    limit = data.get('limit', 20)
    visualizer = QlooVisualizer()
    from qloo_analysis import get_brands, get_places
    raw_brands = get_brands(city, country, limit)
    raw_places = get_places(city, country, limit)
    visualizer.set_data(raw_brands, raw_places)
    ratings = []
    if visualizer.places_data and 'results' in visualizer.places_data and 'entities' in visualizer.places_data['results']:
        for place in visualizer.places_data['results']['entities']:
            properties = place.get('properties', {})
            rating = properties.get('business_rating')
            if rating and rating != 'N/A':
                try:
                    ratings.append(float(rating))
                except (ValueError, TypeError):
                    continue
    return jsonify({'ratings': ratings})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 