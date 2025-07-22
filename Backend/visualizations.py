import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import json
import time
from collections import Counter
import numpy as np
from qloo_analysis import get_brands, get_places, format_brands_output, get_formatted_place_data

# Set style for better-looking plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class QlooVisualizer:
    def __init__(self):
        # Beautiful color palettes
        self.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
                      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9']
        self.gradient_colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
        self.pastel_colors = ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFB3F7', '#B3FFB3']
        
        # Store pre-fetched data
        self.brands_data = None
        self.places_data = None
    
    def set_data(self, brands_data, places_data):
        """Set the pre-fetched data for visualization"""
        self.brands_data = brands_data
        self.places_data = places_data
        
        # Debug: Check what data we're setting
        brands_count = len(brands_data.get('results', {}).get('entities', [])) if brands_data else 0
        places_count = len(places_data.get('results', {}).get('entities', [])) if places_data else 0
        
        # Show first few items to verify data
        if brands_data and 'results' in brands_data and 'entities' in brands_data['results']:
            first_brands = [brand.get('name', 'Unknown') for brand in brands_data['results']['entities'][:3]]
            print(f"[Visualizer] 📊 Set brands data: {brands_count} brands, first 3: {first_brands}")
        else:
            print(f"[Visualizer] ⚠️ Set brands data: {brands_count} brands (no valid data)")
            
        if places_data and 'results' in places_data and 'entities' in places_data['results']:
            first_places = [place.get('name', 'Unknown') for place in places_data['results']['entities'][:3]]
            print(f"[Visualizer] 🏢 Set places data: {places_count} places, first 3: {first_places}")
        else:
            print(f"[Visualizer] ⚠️ Set places data: {places_count} places (no valid data)")
    
    def create_brand_popularity_chart(self, city_name, country_code, limit=50):
        """Create a beautiful bar chart showing brand popularity for a city"""
        print(f"[Visualizer] 🎨 Creating brand popularity chart for {city_name}, {country_code}")
        
        if not self.brands_data or 'results' not in self.brands_data or 'entities' not in self.brands_data['results']:
            print(f"[Visualizer] ❌ No valid brands data for {city_name}")
            return None
        
        brands = []
        popularities = []
        
        for brand in self.brands_data['results']['entities']:
            name = brand.get('name', 'Unknown')
            popularity = brand.get('popularity', 0) * 100  # Convert to percentage
            brands.append(name)
            popularities.append(popularity)
        
        print(f"[Visualizer] ✅ Processed {len(brands)} brands for {city_name}: {brands[:3]}...")  # Show first 3 brands
        
        # Create DataFrame
        df = pd.DataFrame({
            'Brand': brands,
            'Popularity (%)': popularities
        }).sort_values('Popularity (%)', ascending=True)
        
        # Create beautiful horizontal bar chart
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            x=df['Popularity (%)'],
            y=df['Brand'],
            orientation='h',
            marker=dict(
                color=df['Popularity (%)'],
                colorscale='Viridis',
                showscale=True,
                colorbar=dict(
                    title="Popularity %",
                    thickness=15,
                    len=0.5,
                    x=1.02
                )
            ),
            text=df['Popularity (%)'].round(1).astype(str) + '%',
            textposition='auto',
            hovertemplate='<b>%{y}</b><br>Popularity: %{x:.1f}%<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Brand Popularity in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            showlegend=False,
            xaxis=dict(
                title=dict(text="Popularity (%)", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Brands", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=11, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=80, t=80, b=80)
        )
        
        return fig
    
    def create_brand_categories_pie(self, city_name, country_code, limit=50):
        """Create a beautiful pie chart showing brand categories/tags distribution"""
        print(f"[Visualizer] Creating brand categories pie chart for {city_name}, {country_code}")
        
        if not self.brands_data or 'results' not in self.brands_data or 'entities' not in self.brands_data['results']:
            print(f"[Visualizer] No valid brands data for categories in {city_name}")
            return None
        
        all_tags = []
        for brand in self.brands_data['results']['entities']:
            tags = brand.get('tags', [])
            for tag in tags:
                tag_name = tag.get('name', 'Unknown')
                if tag_name:
                    all_tags.append(tag_name)
        
        print(f"[Visualizer] Found {len(all_tags)} total tags for {city_name}")
        
        # Count tag frequencies
        tag_counts = Counter(all_tags)
        
        # Get top 8 tags
        top_tags = dict(tag_counts.most_common(8))
        print(f"[Visualizer] Top tags for {city_name}: {list(top_tags.keys())}")
        
        # Create beautiful pie chart
        fig = go.Figure()
        
        fig.add_trace(go.Pie(
            values=list(top_tags.values()),
            labels=list(top_tags.keys()),
            hole=0.4,  # Donut chart
            marker=dict(
                colors=self.pastel_colors[:len(top_tags)],
                line=dict(color='white', width=2)
            ),
            textinfo='label+percent',
            textposition='inside',
            textfont=dict(size=12, color='#2c3e50'),
            hovertemplate='<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Brand Categories in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="top",
                y=1,
                xanchor="left",
                x=1.02,
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='rgba(0,0,0,0.1)',
                borderwidth=1
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=20, r=20, t=80, b=20)
        )
        
        return fig

    def create_place_ratings_distribution(self, city_name, country_code, limit=50):
        """Create a beautiful histogram showing distribution of place ratings"""
        print(f"[Visualizer] Creating place ratings distribution for {city_name}, {country_code}")
        
        if not self.places_data or 'results' not in self.places_data or 'entities' not in self.places_data['results']:
            print(f"[Visualizer] No valid places data for ratings in {city_name}")
            return None
        
        ratings = []
        for place in self.places_data['results']['entities']:
            properties = place.get('properties', {})
            rating = properties.get('business_rating')
            if rating and rating != 'N/A':
                try:
                    ratings.append(float(rating))
                except (ValueError, TypeError):
                    continue
        
        if not ratings:
            print(f"[Visualizer] No valid ratings found for {city_name}")
            return None
        
        print(f"[Visualizer] Found {len(ratings)} valid ratings for {city_name}")
        
        # Create beautiful histogram
        fig = go.Figure()
        
        fig.add_trace(go.Histogram(
            x=ratings,
            nbinsx=10,
            marker=dict(
                color='#4ECDC4',
                line=dict(color='white', width=1)
            ),
            opacity=0.8,
            hovertemplate='<b>Rating Range</b><br>Count: %{y}<br>Rating: %{x}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Place Ratings Distribution in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            xaxis=dict(
                title=dict(text="Rating", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Number of Places", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=40, t=80, b=80)
        )
        
        return fig

    def create_place_categories_chart(self, city_name, country_code, limit=50):
        """Create a beautiful bar chart showing place categories/tags"""
        print(f"[Visualizer] Creating place categories chart for {city_name}, {country_code}")
        
        if not self.places_data or 'results' not in self.places_data or 'entities' not in self.places_data['results']:
            print(f"[Visualizer] No valid places data for categories in {city_name}")
            return None
        
        all_tags = []
        for place in self.places_data['results']['entities']:
            tags = place.get('tags', [])
            for tag in tags:
                tag_name = tag.get('name', 'Unknown')
                if tag_name:
                    all_tags.append(tag_name)
        
        print(f"[Visualizer] Found {len(all_tags)} total tags for {city_name}")
        
        # Count tag frequencies
        tag_counts = Counter(all_tags)
        
        # Get top 12 tags
        top_tags = dict(tag_counts.most_common(12))
        print(f"[Visualizer] Top tags for {city_name}: {list(top_tags.keys())}")
        
        # Create DataFrame
        df = pd.DataFrame({
            'Category': list(top_tags.keys()),
            'Count': list(top_tags.values())
        }).sort_values('Count', ascending=True)
        
        # Create beautiful horizontal bar chart
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            x=df['Count'],
            y=df['Category'],
            orientation='h',
            marker=dict(
                color=df['Count'],
                colorscale='Plasma',
                showscale=True,
                colorbar=dict(
                    title="Count",
                    thickness=15,
                    len=0.5,
                    x=1.02
                )
            ),
            text=df['Count'],
            textposition='auto',
            hovertemplate='<b>%{y}</b><br>Count: %{x}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Place Categories in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            showlegend=False,
            xaxis=dict(
                title=dict(text="Number of Places", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Categories", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=11, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=80, t=80, b=80)
        )
        
        return fig

    def create_business_density_analysis(self, city_name, country_code, limit=50):
        """Create a scatter plot showing business density and quality analysis"""
        print(f"[Visualizer] Creating business density analysis for {city_name}, {country_code}")
        
        if not self.places_data or 'results' not in self.places_data or 'entities' not in self.places_data['results']:
            print(f"[Visualizer] No valid places data for density analysis in {city_name}")
            return None
        
        # Extract business data
        business_data = []
        for place in self.places_data['results']['entities']:
            properties = place.get('properties', {})
            name = place.get('name', 'Unknown')
            rating = properties.get('business_rating', 'N/A')
            address = properties.get('address', 'N/A')
            
            # Try to extract rating as float
            try:
                rating_float = float(rating) if rating != 'N/A' else None
            except (ValueError, TypeError):
                rating_float = None
            
            # Extract tags for categorization
            tags = place.get('tags', [])
            tag_names = [tag.get('name', '') for tag in tags if tag.get('name')]
            
            business_data.append({
                'name': name,
                'rating': rating_float,
                'address': address,
                'tags': tag_names,
                'tag_count': len(tag_names)
            })
        
        # Filter out places without ratings
        valid_businesses = [b for b in business_data if b['rating'] is not None]
        
        if len(valid_businesses) < 5:
            print(f"[Visualizer] Not enough valid businesses with ratings for {city_name}")
            return None
        
        print(f"[Visualizer] Found {len(valid_businesses)} businesses with valid ratings for {city_name}")
        
        # Create scatter plot
        fig = go.Figure()
        
        # Group by tag count for different colors
        tag_counts = [b['tag_count'] for b in valid_businesses]
        ratings = [b['rating'] for b in valid_businesses]
        names = [b['name'] for b in valid_businesses]
        
        fig.add_trace(go.Scatter(
            x=tag_counts,
            y=ratings,
            mode='markers',
            marker=dict(
                size=12,
                color=ratings,
                colorscale='Viridis',
                showscale=True,
                colorbar=dict(title="Rating", thickness=15, len=0.5, x=1.02)
            ),
            text=names,
            hovertemplate='<b>%{text}</b><br>Rating: %{y}<br>Categories: %{x}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Business Quality vs. Category Diversity in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            xaxis=dict(
                title=dict(text="Number of Categories", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Business Rating", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=80, t=80, b=80)
        )
        
        return fig

    def create_business_hours_analysis(self, city_name, country_code, limit=50):
        """Create a heatmap showing business activity patterns"""
        print(f"[Visualizer] Creating business hours analysis for {city_name}, {country_code}")
        
        if not self.places_data or 'results' not in self.places_data or 'entities' not in self.places_data['results']:
            print(f"[Visualizer] No valid places data for hours analysis in {city_name}")
            return None
        
        # Simulate business hours data (since Qloo API doesn't provide this)
        # In a real implementation, you'd extract this from the API response
        hours_data = []
        for place in self.places_data['results']['entities']:
            properties = place.get('properties', {})
            # Simulate business hours based on place type
            tags = place.get('tags', [])
            tag_names = [tag.get('name', '').lower() for tag in tags]
            
            # Assign typical hours based on business type
            if any(word in ' '.join(tag_names) for word in ['restaurant', 'cafe', 'bar', 'food']):
                # Food establishments: 6 AM - 11 PM
                hours = list(range(6, 23))
            elif any(word in ' '.join(tag_names) for word in ['shop', 'store', 'retail']):
                # Retail: 9 AM - 8 PM
                hours = list(range(9, 20))
            elif any(word in ' '.join(tag_names) for word in ['office', 'business', 'professional']):
                # Offices: 8 AM - 6 PM
                hours = list(range(8, 18))
            else:
                # Default: 9 AM - 6 PM
                hours = list(range(9, 18))
            
            hours_data.extend(hours)
        
        if not hours_data:
            print(f"[Visualizer] No hours data generated for {city_name}")
            return None
        
        # Count business activity by hour
        hour_counts = Counter(hours_data)
        
        # Create heatmap data
        hours = list(range(24))
        counts = [hour_counts.get(hour, 0) for hour in hours]
        
        # Create bar chart (heatmap alternative)
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            x=hours,
            y=counts,
            marker=dict(
                color=counts,
                colorscale='Blues',
                showscale=True,
                colorbar=dict(title="Business Activity", thickness=15, len=0.5, x=1.02)
            ),
            hovertemplate='<b>Hour: %{x}:00</b><br>Active Businesses: %{y}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Business Activity Patterns in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            xaxis=dict(
                title=dict(text="Hour of Day", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                tickmode='array',
                tickvals=list(range(0, 24, 2)),
                ticktext=[f'{h:02d}:00' for h in range(0, 24, 2)],
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Number of Active Businesses", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=80, t=80, b=80)
        )
        
        return fig

    def create_price_range_analysis(self, city_name, country_code, limit=50):
        """Create a chart showing price range distribution"""
        print(f"[Visualizer] Creating price range analysis for {city_name}, {country_code}")
        
        if not self.places_data or 'results' not in self.places_data or 'entities' not in self.places_data['results']:
            print(f"[Visualizer] No valid places data for price analysis in {city_name}")
            return None
        
        # Simulate price ranges based on business type and rating
        price_data = []
        for place in self.places_data['results']['entities']:
            properties = place.get('properties', {})
            rating = properties.get('business_rating', 'N/A')
            tags = place.get('tags', [])
            tag_names = [tag.get('name', '').lower() for tag in tags]
            
            # Assign price range based on business type and rating
            try:
                rating_float = float(rating) if rating != 'N/A' else 3.0
            except (ValueError, TypeError):
                rating_float = 3.0
            
            # Base price on business type
            if any(word in ' '.join(tag_names) for word in ['luxury', 'premium', 'high-end']):
                base_price = 4
            elif any(word in ' '.join(tag_names) for word in ['restaurant', 'cafe', 'bar']):
                base_price = 3
            elif any(word in ' '.join(tag_names) for word in ['shop', 'store', 'retail']):
                base_price = 2
            else:
                base_price = 2
            
            # Adjust based on rating
            price_level = min(5, max(1, base_price + (rating_float - 3.0) * 0.5))
            price_data.append(price_level)
        
        if not price_data:
            print(f"[Visualizer] No price data generated for {city_name}")
            return None
        
        # Create price range categories
        price_ranges = {
            'Budget ($)': len([p for p in price_data if p <= 2]),
            'Moderate ($$)': len([p for p in price_data if 2 < p <= 3.5]),
            'Premium ($$$)': len([p for p in price_data if 3.5 < p <= 4.5]),
            'Luxury ($$$$)': len([p for p in price_data if p > 4.5])
        }
        
        # Create pie chart
        fig = go.Figure()
        
        fig.add_trace(go.Pie(
            values=list(price_ranges.values()),
            labels=list(price_ranges.keys()),
            hole=0.4,
            marker=dict(
                colors=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
                line=dict(color='white', width=2)
            ),
            textinfo='label+percent',
            textposition='inside',
            textfont=dict(size=12, color='#2c3e50'),
            hovertemplate='<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text=f'Price Range Distribution in {city_name}',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            showlegend=True,
            legend=dict(
                orientation="v",
                yanchor="top",
                y=1,
                xanchor="left",
                x=1.02,
                bgcolor='rgba(255,255,255,0.8)',
                bordercolor='rgba(0,0,0,0.1)',
                borderwidth=1
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=20, r=20, t=80, b=20)
        )
        
        return fig

    def create_comparison_chart(self, cities_data):
        """Create a beautiful comparison chart for multiple cities"""
        # cities_data should be a list of tuples: [(city_name, country_code, limit), ...]
        
        all_data = []
        for city_name, country_code, limit in cities_data:
            data = get_brands(city_name, country_code, limit)
            if data and 'results' in data and 'entities' in data['results']:
                avg_popularity = np.mean([
                    brand.get('popularity', 0) * 100 
                    for brand in data['results']['entities']
                ])
                all_data.append({
                    'City': city_name,
                    'Average Brand Popularity (%)': avg_popularity
                })
        
        if not all_data:
            return None
        
        df = pd.DataFrame(all_data)
        
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            x=df['City'],
            y=df['Average Brand Popularity (%)'],
            marker=dict(
                color=df['Average Brand Popularity (%)'],
                colorscale='Viridis',
                showscale=True
            ),
            text=df['Average Brand Popularity (%)'].round(1).astype(str) + '%',
            textposition='auto',
            hovertemplate='<b>%{x}</b><br>Avg Popularity: %{y:.1f}%<extra></extra>'
        ))
        
        fig.update_layout(
            title=dict(
                text='Average Brand Popularity Comparison Across Cities',
                font=dict(size=20, color='#2c3e50'),
                x=0.5
            ),
            height=500,
            showlegend=False,
            xaxis=dict(
                title=dict(text="City", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Average Brand Popularity (%)", font=dict(size=14, color='#34495e')),
                tickfont=dict(size=12, color='#34495e'),
                gridcolor='rgba(0,0,0,0.1)',
                zeroline=False
            ),
            plot_bgcolor='rgba(255,255,255,0)',
            paper_bgcolor='rgba(255,255,255,0)',
            margin=dict(l=80, r=40, t=80, b=80)
        )
        
        return fig

    def generate_all_visualizations(self, city_name, country_code, limit=50):
        """Generate all visualizations for a city and return as JSON-serializable data"""
        visualizations = {}
        
        # Brand popularity chart
        brand_pop_chart = self.create_brand_popularity_chart(city_name, country_code, limit)
        if brand_pop_chart:
            visualizations['brand_popularity'] = brand_pop_chart.to_json()
        
        # Brand categories pie chart
        brand_cat_chart = self.create_brand_categories_pie(city_name, country_code, limit)
        if brand_cat_chart:
            visualizations['brand_categories'] = brand_cat_chart.to_json()
        
        # Place ratings distribution
        place_ratings_chart = self.create_place_ratings_distribution(city_name, country_code, limit)
        if place_ratings_chart:
            visualizations['place_ratings'] = place_ratings_chart.to_json()
        
        # Place categories chart
        place_cat_chart = self.create_place_categories_chart(city_name, country_code, limit)
        if place_cat_chart:
            visualizations['place_categories'] = place_cat_chart.to_json()
        
        # NEW: Business density analysis
        business_density_chart = self.create_business_density_analysis(city_name, country_code, limit)
        if business_density_chart:
            visualizations['business_density'] = business_density_chart.to_json()
        
        # NEW: Business hours analysis
        business_hours_chart = self.create_business_hours_analysis(city_name, country_code, limit)
        if business_hours_chart:
            visualizations['business_hours'] = business_hours_chart.to_json()
        
        # NEW: Price range analysis
        price_range_chart = self.create_price_range_analysis(city_name, country_code, limit)
        if price_range_chart:
            visualizations['price_range'] = price_range_chart.to_json()
        
        return visualizations

# Example usage and testing
if __name__ == "__main__":
    visualizer = QlooVisualizer()
    
    # Test with Birmingham
    print("Generating visualizations for Birmingham...")
    viz_data = visualizer.generate_all_visualizations("birmingham", "GB", limit=50)
    
    # Save visualizations to JSON file
    with open('visualization_data.json', 'w') as f:
        json.dump(viz_data, f, indent=2)
    
    print("Visualizations generated and saved to visualization_data.json") 