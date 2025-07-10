import requests
import os
import json

# --- Qloo API Configuration ---
API_KEY = os.getenv('QLOO_API_KEY', 'rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0') # Ensure this is your actual Qloo API Key
URL = "https://hackathon.api.qloo.com/v2/insights"

headers = {
    "accept": "application/json",
    "X-Api-Key": API_KEY
}

# --- Helper Function for Qloo API Request ---
def _make_qloo_request(city_name, country_code, limit, signal_tags=None, signal_weight=1.0):
    """
    Helper function to make the API request.
    This version does NOT save to output.json directly.
    The main function will handle the final output file.
    """
    params = {
        "filter.type": "urn:entity:place",
        "filter.location.query": city_name,
        "filter.geocode.country_code": country_code,
        "take": limit,
    }
    if signal_tags:
        # If signal_tags is a string and contains a comma, split it into a list
        if isinstance(signal_tags, str) and ',' in signal_tags:
            params["signal.interests.tags"] = signal_tags.split(',')
        else:
            params["signal.interests.tags"] = signal_tags
        params["signal.interests.tags.weight"] = signal_weight

    try:
        response = requests.get(URL, headers=headers, params=params)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error making Qloo API request: {e}")
        return None
    except json.JSONDecodeError:
        print(f"Error decoding JSON from Qloo API response: {response.text}")
        return None

# --- Raw Place Listing Function ---

def get_formatted_place_data(city_name, country_code, limit=20):
    """
    Makes a raw Qloo API call for general 'place' entities and formats their details
    into a list of strings, similar to the example provided.
    """
    print(f"\n--- Fetching Raw Places for {city_name}, {country_code} (Limit: {limit}) ---")
    
    data = _make_qloo_request(city_name, country_code, limit)

    formatted_outputs = []

    if not data or 'results' not in data or 'entities' not in data['results']:
        formatted_outputs.append(f"No entities found or error in API response for {city_name}, {country_code}.")
        return formatted_outputs

    for entity in data['results']['entities']:
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

    return formatted_outputs

# --- Main Execution Block ---
if __name__ == "__main__":
    if API_KEY == 'YOUR_QLOO_API_KEY_HERE':
        print("WARNING: QLOO_API_KEY is not set or is using the placeholder. "
              "Please set the environment variable 'QLOO_API_KEY' or replace the placeholder "
              "in the script with your actual Qloo API key.")
        exit()

    all_formatted_data = []

    # You can change it to whatever you want, maybe london, GB, new york, US etc.
    london_data = get_formatted_place_data("birmingham", "GB", limit=20)
    all_formatted_data.extend(london_data)

    # Store all formatted data to output.json
    output_filename = 'output.json'
    try:
        with open(output_filename, 'w') as f:
            # We'll dump a list of strings, so it's a valid JSON array of strings
            json.dump(all_formatted_data, f, indent=4)
        print(f"\nAll formatted place data saved to {output_filename}")
    except IOError as e:
        print(f"Error saving data to {output_filename}: {e}")

    # Optionally, print to console as well
    print("\n--- Consolidated Output (also saved to output.json) ---")
    for item in all_formatted_data:
        print(item)
