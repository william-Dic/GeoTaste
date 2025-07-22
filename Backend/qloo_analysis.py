import requests
import os
import json
import time

# --- Qloo API Configuration ---
API_KEY = os.getenv('QLOO_API_KEY', 'rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0') # Ensure this is your actual Qloo API Key
URL = "https://hackathon.api.qloo.com/v2/insights"

headers = {
    "accept": "application/json",
    "X-Api-Key": API_KEY
}

# --- Helper Function for Qloo API Request ---
def get_brands(city_name, country_code, limit, signal_tags=None, signal_weight=1.0):
    """
    Helper function to make the API request.
    """
    params = {
        "filter.type": "urn:entity:brand",
        "filter.location.query": city_name,
        "filter.geocode.country_code": country_code,
        "take": limit,
    }
    if signal_tags:
        if isinstance(signal_tags, str) and ',' in signal_tags:
            params["signal.interests.tags"] = signal_tags.split(',')
        else:
            params["signal.interests.tags"] = signal_tags
        params["signal.interests.tags.weight"] = signal_weight

    print(f"[QLOO] 🔍 Fetching brands for: {city_name}, {country_code}, limit: {limit}")
    print(f"[QLOO] 📡 API params: {params}")

    try:
        response = requests.get(URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Debug: Check what we got back
        if data and 'results' in data and 'entities' in data['results']:
            brand_names = [brand.get('name', 'Unknown') for brand in data['results']['entities'][:3]]
            print(f"[QLOO] ✅ Brands API response: {len(data['results']['entities'])} brands")
            print(f"[QLOO] 📊 First 3 brands: {brand_names}")
        else:
            print(f"[QLOO] ⚠️ No valid brands in API response")
            print(f"[QLOO] 📄 Raw response: {data}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"[QLOO] ❌ Error making Qloo API request: {e}")
        return None
    except json.JSONDecodeError:
        print(f"[QLOO] ❌ Error decoding JSON from Qloo API response: {response.text}")
        return None

# (get_places function remains the same, so it's omitted for brevity)
def get_places(city_name, country_code, limit, signal_tags=None, signal_weight=1.0, max_retries=3):
    """
    Helper function to make the Qloo API request with basic retry logic.
    """
    params = {
        "filter.type": "urn:entity:place",
        "filter.location.query": city_name,
        "filter.geocode.country_code": country_code,
        "take": limit,
    }
    if signal_tags:
        if isinstance(signal_tags, str) and ',' in signal_tags:
            params["signal.interests.tags"] = signal_tags.split(',')
        else:
            params["signal.interests.tags"] = signal_tags
        params["signal.interests.tags.weight"] = signal_weight
    else:
        params.pop("signal.interests.tags", None)
        params.pop("signal.interests.tags.weight", None)

    print(f"[QLOO] 🔍 Fetching places for: {city_name}, {country_code}, limit: {limit}")
    print(f"[QLOO] 📡 API params: {params}")

    for attempt in range(max_retries):
        try:
            response = requests.get(URL, headers=headers, params=params)
            response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
            data = response.json()
            
            # Debug: Check what we got back
            if data and 'results' in data and 'entities' in data['results']:
                place_names = [place.get('name', 'Unknown') for place in data['results']['entities'][:3]]
                print(f"[QLOO] ✅ Places API response: {len(data['results']['entities'])} places")
                print(f"[QLOO] 🏢 First 3 places: {place_names}")
            else:
                print(f"[QLOO] ⚠️ No valid places in API response")
                print(f"[QLOO] 📄 Raw response: {data}")
            
            return data
        except requests.exceptions.HTTPError as http_err:
            print(f"[QLOO] ❌ HTTP error occurred during Qloo API request (Attempt {attempt+1}/{max_retries}): {http_err} - Status Code: {response.status_code}")
            if response.status_code == 401 or response.status_code == 403:
                print("[QLOO] 🔐 Authentication error (401/403). Please check your QLOO_API_KEY.")
                return None # Don't retry on auth errors
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt # Exponential backoff
                print(f"[QLOO] ⏳ Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("[QLOO] ❌ Max retries reached for Qloo API request.")
                return None
        except requests.exceptions.RequestException as req_err:
            print(f"[QLOO] ❌ Network/Request error occurred during Qloo API request (Attempt {attempt+1}/{max_retries}): {req_err}")
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt
                print(f"[QLOO] ⏳ Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("[QLOO] ❌ Max retries reached for Qloo API request.")
                return None
        except json.JSONDecodeError:
            print(f"[QLOO] ❌ Error decoding JSON from Qloo API response (Attempt {attempt+1}/{max_retries}). Response text: {response.text}")
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt
                print(f"[QLOO] ⏳ Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("[QLOO] ❌ Max retries reached for Qloo API request.")
                return None
    return None # Return None if all retries fail
    
def format_brands_output(api_data):
    """
    Formats the JSON response from the get_brands function into a readable string.
    This version is updated to handle the new API response structure.
    """
    if not api_data:
        return "API response is empty."

    # Safely get the list of entities from response['results']['entities']
    # .get('results', {}) returns an empty dict if 'results' is not found
    entities_list = api_data.get('results', {}).get('entities')

    # Check if the entities list exists and is not empty
    if not entities_list:
        return "No brand data found in the API response."

    output_parts = []
    
    # Try to create a header with the location name from the response
    try:
        # The location info is in the same place as before
        location_info = api_data['query']['localities']['filter'][0]
        location_name = location_info.get('name', 'Unknown Location')
        header = f"===== Brand Recommendations for {location_name} ====="
        output_parts.append(header)
    except (KeyError, IndexError, TypeError):
        output_parts.append("===== Brand Recommendations =====")

    # Loop through each brand in the now correctly located entities_list
    for i, brand in enumerate(entities_list):
        name = brand.get('name', 'N/A')
        
        popularity_score = brand.get('popularity', 0)
        popularity_percent = f"{popularity_score * 100:.2f}%"

        properties = brand.get('properties', {})
        description = properties.get('short_description', 'No description available.')
        image_url = properties.get('image', {}).get('url', 'No image URL.')

        tags_list = brand.get('tags', [])
        tag_names = [tag.get('name') for tag in tags_list if tag.get('name')]
        tags_str = ", ".join(tag_names) if tag_names else "No tags"

        brand_str = (
            f"--- {i+1}. {name} ---\n"
            f"  - Popularity: {popularity_percent}\n"
            f"  - Description: {description}\n"
            f"  - Tags: {tags_str}\n"
            f"  - Image URL: {image_url}"
        )
        output_parts.append(brand_str)

    return "\n\n".join(output_parts)

def get_formatted_place_data(city_name, country_code, limit=20):
    """
    Makes a Qloo API call for general 'place' entities and formats their details
    into a list of strings. Does NOT include per-place LLM insights.
    """
    print(f"\n--- Fetching Raw Places for {city_name}, {country_code} (Limit: {limit}) ---")

    data = get_places(city_name, country_code, limit) # Use the new get_places helper

    formatted_outputs = []
    all_places_raw_data = [] # To store raw data for general LLM call

    if not data or 'results' not in data or 'entities' not in data['results']:
        formatted_outputs.append(f"No entities found or error in API response for {city_name}, {country_code}. Please check QLOO_API_KEY and try again.")
        return formatted_outputs, all_places_raw_data

    for entity in data['results']['entities']:
        all_places_raw_data.append(entity) # Store raw data
        output_parts = []

        output_parts.append(f"Name: {entity.get('name', 'N/A')}")
        output_parts.append(f"ID: {entity.get('entity_id', 'N/A')}")

        properties = entity.get('properties', {})

        address = properties.get('address', 'N/A')
        output_parts.append(f"Address: {address}")

        rating = properties.get('business_rating', 'N/A')
        output_parts.append(f"Rating: {rating}")

        description = properties.get('description', 'N/A')
        if description != 'N/A':
            output_parts.append(f"Description: {description}")

        tags = entity.get('tags', [])
        if tags:
            tag_names = [tag.get('name', 'N/A') for tag in tags]
            tag_ids = [tag.get('id', 'N/A') for tag in tags]
            output_parts.append(f"Tags (Names): {', '.join(tag_names)}")
            output_parts.append(f"Tags (IDs): {', '.join(tag_ids)}")

        keywords = properties.get('keywords', [])
        if keywords:
            keyword_names = [kw.get('name', 'N/A') for kw in keywords]
            output_parts.append(f"Keywords: {', '.join(keyword_names)}")

        formatted_outputs.append("\n".join(output_parts))
        formatted_outputs.append("-" * 30) # Separator

    return formatted_outputs, all_places_raw_data
    
# --- Main Execution Block ---
if __name__ == "__main__":
    formatted_places, raw_places = get_formatted_place_data("los angeles", "US", limit=5)
    for place_output in formatted_places:
        print(place_output)

    # Get brand data for Birmingham
    # birmingham_data = get_brands("Beijing", "CN", limit=50)

    # # Check if we got data back before trying to format it
    # if birmingham_data:
    #     # Use the corrected function to format the output
    #     formatted_output = format_brands_output(birmingham_data)
    #     print(formatted_output)
    # else:
    #     print("Could not retrieve brand data.")