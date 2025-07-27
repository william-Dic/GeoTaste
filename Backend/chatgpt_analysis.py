import json
import os
from openai import OpenAI
from qloo_analysis import get_brands, get_places

# Set up OpenAI client
client = OpenAI(api_key="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")

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
    Create a comprehensive prompt for ChatGPT analysis
    """
    prompt = f"""
    Please analyze the business environment of {city_name}, {country_code} based on the following data:

    **Business Data Summary:**
    - Total brands analyzed: {len(data_summary['brands'])}
    - Total places analyzed: {len(data_summary['places'])}

    **Top Business Categories:**
    - Brand categories: {dict(list(data_summary['brand_categories'].items())[:5])}
    - Place categories: {dict(list(data_summary['place_categories'].items())[:5])}

    **Top Rated Places:**
    {json.dumps(data_summary['top_rated_places'][:3], indent=2)}

    **Most Popular Brands:**
    {json.dumps(data_summary['popular_brands'][:3], indent=2)}

    **Analysis Request:**
    Please provide a comprehensive business environment analysis covering:

    1. **Market Overview**: What type of business environment exists in {city_name}?
    2. **Business Diversity**: How diverse is the business landscape?
    3. **Quality Assessment**: What's the overall quality of businesses?
    4. **Market Opportunities**: What business opportunities exist?
    5. **Competitive Landscape**: How competitive is the market?
    6. **Consumer Preferences**: What do the popular brands and top-rated places reveal about local preferences?

    Please provide a clear, professional analysis that would be useful for business decision-makers considering this market. Keep the analysis concise but comprehensive (around 300-400 words).
    """
    
    return prompt

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
        
        # Create a context-aware response
        context_prompt = f"""
        You are a business analyst assistant for {city_name}, {country_code}. 
        
        **Business Environment Context:**
        {analysis_result['analysis']}
        
        **User Question:** {user_message}
        
        Please provide a helpful response based on the business environment analysis above. 
        If the user is asking about something not covered in the analysis, provide general business insights about {city_name}.
        Keep your response conversational and informative (100-200 words).
        """
        
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