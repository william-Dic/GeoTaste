import json
import os
from openai import OpenAI
from qloo_analysis import get_brands, get_places

# Set up OpenAI client
client = OpenAI()

def analyze_business_environment(city_name, country_code, limit=50):
    """
    Analyze the business environment of a place using ChatGPT based on Qloo data
    """
    try:
        print(f"[ChatGPT Analysis] 🚀 Starting analysis for {city_name}, {country_code}")
        
        # Fetch data from Qloo
        print(f"[ChatGPT Analysis] 📡 Fetching brands data...")
        brands_data = get_brands(city_name, country_code, limit)
        
        print(f"[ChatGPT Analysis] 📡 Fetching places data...")
        places_data = get_places(city_name, country_code, limit)
        
        if not brands_data or not places_data:
            print(f"[ChatGPT Analysis] ❌ Failed to fetch data from Qloo API")
            return {
                "error": "Failed to fetch data from Qloo API",
                "analysis": None
            }
        
        print(f"[ChatGPT Analysis] ✅ Qloo data fetched successfully")
        
        # Extract key information from the data
        brands = brands_data.get('results', {}).get('entities', [])
        places = places_data.get('results', {}).get('entities', [])
        
        print(f"[ChatGPT Analysis] 📊 Found {len(brands)} brands and {len(places)} places")
        
        # Prepare data summary for ChatGPT
        print(f"[ChatGPT Analysis] 🔄 Preparing data summary...")
        data_summary = prepare_data_summary(brands, places, city_name, country_code)
        
        # Create prompt for ChatGPT
        print(f"[ChatGPT Analysis] 📝 Creating analysis prompt...")
        prompt = create_analysis_prompt(data_summary, city_name, country_code)
        
        print(f"[ChatGPT Analysis] 🤖 Sending request to ChatGPT...")
        
        # Call ChatGPT using the correct API structure
        response = client.responses.create(
            model="gpt-4.1",
            input=prompt
        )
        
        analysis = response.output_text
        
        print(f"[ChatGPT Analysis] ✅ Analysis completed successfully, length: {len(analysis)}")
        
        return {
            "success": True,
            "analysis": analysis,
            "city": city_name,
            "country": country_code,
            "data_points": {
                "brands_count": len(brands),
                "places_count": len(places)
            }
        }
        
    except Exception as e:
        print(f"[ChatGPT Analysis] 💥 Exception: {str(e)}")
        print(f"[ChatGPT Analysis] 💥 Exception type: {type(e).__name__}")
        import traceback
        print(f"[ChatGPT Analysis] 💥 Full traceback: {traceback.format_exc()}")
        return {
            "error": f"Analysis failed: {str(e)}",
            "analysis": None
        }

def prepare_data_summary(brands, places, city_name, country_code):
    """
    Prepare a summary of the Qloo data for ChatGPT analysis
    """
    summary = {
        "city": city_name,
        "country": country_code,
        "brands": [],
        "places": [],
        "brand_categories": {},
        "place_categories": {},
        "top_rated_places": [],
        "popular_brands": []
    }
    
    # Process brands
    for brand in brands[:20]:  # Limit to top 20 for analysis
        brand_info = {
            "name": brand.get('name', 'Unknown'),
            "popularity": brand.get('popularity', 0),
            "categories": [tag.get('name', '') for tag in brand.get('tags', [])]
        }
        summary["brands"].append(brand_info)
        
        # Count categories
        for category in brand_info["categories"]:
            if category:
                summary["brand_categories"][category] = summary["brand_categories"].get(category, 0) + 1
    
    # Process places
    for place in places[:20]:  # Limit to top 20 for analysis
        properties = place.get('properties', {})
        place_info = {
            "name": place.get('name', 'Unknown'),
            "rating": properties.get('business_rating', 'N/A'),
            "categories": [tag.get('name', '') for tag in place.get('tags', [])],
            "price_range": properties.get('price_range', 'N/A')
        }
        summary["places"].append(place_info)
        
        # Count categories
        for category in place_info["categories"]:
            if category:
                summary["place_categories"][category] = summary["place_categories"].get(category, 0) + 1
    
    # Get top rated places
    rated_places = [p for p in places if p.get('properties', {}).get('business_rating') and p['properties']['business_rating'] != 'N/A']
    rated_places.sort(key=lambda x: float(x['properties']['business_rating']), reverse=True)
    
    for place in rated_places[:5]:
        summary["top_rated_places"].append({
            "name": place.get('name', 'Unknown'),
            "rating": place.get('properties', {}).get('business_rating', 'N/A'),
            "categories": [tag.get('name', '') for tag in place.get('tags', [])]
        })
    
    # Get popular brands
    popular_brands = sorted(brands, key=lambda x: x.get('popularity', 0), reverse=True)
    for brand in popular_brands[:5]:
        summary["popular_brands"].append({
            "name": brand.get('name', 'Unknown'),
            "popularity": brand.get('popularity', 0),
            "categories": [tag.get('name', '') for tag in brand.get('tags', [])]
        })
    
    return summary

def create_analysis_prompt(data_summary, city_name, country_code):
    """
    Create a comprehensive prompt for ChatGPT analysis with improved system prompt
    """
    
    # Format the data for better presentation
    brand_categories_str = format_categories(data_summary['brand_categories'])
    place_categories_str = format_categories(data_summary['place_categories'])
    top_places_str = format_top_places(data_summary['top_rated_places'])
    popular_brands_str = format_popular_brands(data_summary['popular_brands'])
    
    prompt = f"""You are a senior business analyst specializing in market intelligence and location-based business insights. Your role is to provide direct, actionable business analysis without any introductory phrases or AI assistant language.

**BUSINESS ENVIRONMENT ANALYSIS BRIEF**

**Location:** {city_name}, {country_code}
**Data Scope:** {len(data_summary['brands'])} brands, {len(data_summary['places'])} businesses analyzed

**MARKET DATA**

**Brand Landscape:**
{brand_categories_str}

**Business Categories:**
{place_categories_str}

**Top Performing Businesses:**
{top_places_str}

**Market Leaders:**
{popular_brands_str}

**ANALYSIS REQUIREMENTS**

Provide a structured business environment analysis in the following format:

**MARKET OVERVIEW**
[Direct analysis of the business environment type and characteristics]

**BUSINESS DIVERSITY**
[Assessment of market diversity and sector distribution]

**QUALITY METRICS**
[Evaluation of business quality based on ratings and performance]

**OPPORTUNITY LANDSCAPE**
[Identification of market gaps and business opportunities]

**COMPETITIVE DYNAMICS**
[Analysis of market competition and positioning]

**CONSUMER INSIGHTS**
[Key insights about local consumer preferences and behavior]

**EXECUTIVE SUMMARY**
[2-3 key takeaways for business decision-makers]

Write in a professional, direct tone suitable for executive briefings. Avoid any conversational phrases, introductions, or AI assistant language. Focus on actionable insights and data-driven conclusions. Target length: 350-450 words.
"""
    
    return prompt

def format_categories(categories_dict):
    """Format categories for better presentation"""
    if not categories_dict:
        return "No category data available"
    
    sorted_categories = sorted(categories_dict.items(), key=lambda x: x[1], reverse=True)
    formatted = []
    for category, count in sorted_categories[:8]:
        formatted.append(f"• {category}: {count} businesses")
    
    return "\n".join(formatted)

def format_top_places(places):
    """Format top rated places for better presentation"""
    if not places:
        return "No rating data available"
    
    formatted = []
    for place in places[:3]:
        rating = place.get('rating', 'N/A')
        categories = ', '.join(place.get('categories', [])[:2])
        formatted.append(f"• {place['name']} (Rating: {rating}, Categories: {categories})")
    
    return "\n".join(formatted)

def format_popular_brands(brands):
    """Format popular brands for better presentation"""
    if not brands:
        return "No brand data available"
    
    formatted = []
    for brand in brands[:3]:
        popularity = brand.get('popularity', 0)
        popularity_pct = f"{popularity * 100:.1f}%" if popularity else "N/A"
        categories = ', '.join(brand.get('categories', [])[:2])
        formatted.append(f"• {brand['name']} (Popularity: {popularity_pct}, Categories: {categories})")
    
    return "\n".join(formatted)

def get_chat_response(user_message, city_name, country_code):
    """
    Get a chat response from ChatGPT about the business environment
    """
    try:
        # First, get the business environment analysis
        analysis_result = analyze_business_environment(city_name, country_code)
        
        if analysis_result.get("error"):
            return {
                "error": analysis_result["error"],
                "response": None
            }
        
        # Create a context-aware response with improved prompt
        context_prompt = f"""You are a business intelligence specialist for {city_name}, {country_code}. Provide direct, professional responses without AI assistant language.

**BUSINESS CONTEXT:**
{analysis_result['analysis']}

**USER INQUIRY:** {user_message}

Provide a concise, professional response (100-150 words) that directly addresses the user's question using the business analysis above. If the question is outside the analysis scope, provide relevant business insights about {city_name}. Write in a professional tone suitable for business communications."""
        
        response = client.responses.create(
            model="gpt-4.1",
            input=context_prompt
        )
        
        return {
            "success": True,
            "response": response.output_text,
            "analysis": analysis_result['analysis']
        }
        
    except Exception as e:
        return {
            "error": f"Chat response failed: {str(e)}",
            "response": None
        }

if __name__ == "__main__":
    # Test the analysis
    result = analyze_business_environment("London", "GB", limit=30)
    print(json.dumps(result, indent=2)) 