import requests
import os
import json
import time # For rate limiting/backoff
from google import genai # Import the Gemini library

# --- Configuration ---
# Qloo API Key: It's highly recommended to set this as an environment variable.
# For example: export QLOO_API_KEY='your_qloo_api_key_here'
QLOO_API_KEY = os.getenv('QLOO_API_KEY',"rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0")
QLOO_URL = "https://hackathon.api.qloo.com/v2/insights"

# Gemini LLM Configuration: It's highly recommended to set this as an environment variable.
# For example: export GEMINI_API_KEY='your_gemini_api_key_here'
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY',"AIzaSyBw-AY9QEtfecfEoskdoPoos_vse3lL9ws")
GEMINI_MODEL = "gemini-2.5-flash" # Using a fast model for this task

# --- Initialize Clients ---
qloo_headers = {
    "accept": "application/json",
    "X-Api-Key": QLOO_API_KEY
}

try:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini client. Ensure GEMINI_API_KEY environment variable is set. Error: {e}")
    gemini_client = None


# --- Helper Function for Qloo API Request ---
def _make_qloo_request(city_name, country_code, limit, signal_tags=None, signal_weight=1.0, max_retries=3):
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

    for attempt in range(max_retries):
        try:
            response = requests.get(QLOO_URL, headers=qloo_headers, params=params)
            response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
            data = response.json()
            return data
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred during Qloo API request (Attempt {attempt+1}/{max_retries}): {http_err} - Status Code: {response.status_code}")
            if response.status_code == 401 or response.status_code == 403:
                print("Authentication error (401/403). Please check your QLOO_API_KEY.")
                return None # Don't retry on auth errors
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt # Exponential backoff
                print(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("Max retries reached for Qloo API request.")
                return None
        except requests.exceptions.RequestException as req_err:
            print(f"Network/Request error occurred during Qloo API request (Attempt {attempt+1}/{max_retries}): {req_err}")
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt
                print(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("Max retries reached for Qloo API request.")
                return None
        except json.JSONDecodeError:
            print(f"Error decoding JSON from Qloo API response (Attempt {attempt+1}/{max_retries}). Response text: {response.text}")
            if attempt < max_retries - 1:
                sleep_time = 2 ** attempt
                print(f"Retrying in {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print("Max retries reached for Qloo API request.")
                return None
    return None # Return None if all retries fail


# --- LLM-based General Business Insight Generation (Called Once) ---
def get_general_business_insights_from_llm(place_data_list, city_name, country_code):
    """
    Uses an LLM to generate general business environment and opportunity insights
    based on a list of places, called once.
    """
    if gemini_client is None:
        return "Gemini client not initialized. Cannot generate LLM insights."

    if not place_data_list:
        return "No place data provided to generate general insights."

    # Concatenate relevant information from the first few places for context
    # Adjust this logic based on how much info you want to feed the LLM for 'general' insight
    context_info = []
    for i, place in enumerate(place_data_list[:5]): # Use up to the first 5 places for context
        name = place.get('name', 'N/A')
        description = place.get('properties', {}).get('description', 'No description available.')
        tags_names = [tag.get('name', 'N/A') for tag in place.get('tags', [])]
        keywords = [kw.get('name', 'N/A') for kw in place.get('properties', {}).get('keywords', [])]
        context_info.append(f"Place {i+1}:\n  Name: {name}\n  Description: {description}\n  Tags: {', '.join(tags_names)}\n  Keywords: {', '.join(keywords)}\n")

    full_context = "\n".join(context_info)

    prompt = f"""
Given the characteristics of places found in {city_name}, {country_code}, which include:

{full_context}

What are some general types of businesses or opportunities that are likely to be profitable in an area with these kinds of establishments? Focus on what can make money for a new business owner or investor.

Provide a concise, general overview of the business environment and then list specific, actionable business ideas that are common or trending around such places.
"""
    try:
        response = gemini_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error generating general LLM insights for {city_name}: {e}")
        return "Could not generate general business insights (LLM error)."


# --- Formatted Place Data Function (without per-place LLM calls) ---
def get_formatted_place_data(city_name, country_code, limit=20):
    """
    Makes a Qloo API call for general 'place' entities and formats their details
    into a list of strings. Does NOT include per-place LLM insights.
    """
    print(f"\n--- Fetching Raw Places for {city_name}, {country_code} (Limit: {limit}) ---")

    data = _make_qloo_request(city_name, country_code, limit)

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

    # --- Fetch and Process Data ---
    all_formatted_place_details = []
    all_raw_place_data = [] # Collect raw data for the general LLM call

    target_city = "Birmingham"
    target_country = "GB"
    fetch_limit = 50 # Can fetch more places now since no per-place LLM call

    # Get formatted place details and all raw place data
    formatted_details, raw_data = get_formatted_place_data(target_city, target_country, limit=fetch_limit)
    all_formatted_place_details.extend(formatted_details)
    all_raw_place_data.extend(raw_data)

    # --- Generate General Business Insights (Once per run) ---
    print(f"\n--- Generating General Business Insights for {target_city}, {target_country} (Using LLM Once) ---")
    general_llm_insights = get_general_business_insights_from_llm(all_raw_place_data, target_city, target_country)
    print(general_llm_insights)
    # Prepend general insights to the list of outputs
    overall_output = [f"### General Business Insights for {target_city}, {target_country} ###\n"]
    overall_output.append(general_llm_insights)
    overall_output.append("\n" + "=" * 50 + "\n")
    overall_output.extend(all_formatted_place_details)


    # --- Save to File ---
    output_filename = 'output_general_llm_insight.json'
    try:
        with open(output_filename, 'w') as f:
            json.dump(overall_output, f, indent=4)
        print(f"\nAll formatted place data with general LLM insight saved to {output_filename}")
    except IOError as e:
        print(f"Error saving data to {output_filename}: {e}")

    # --- Print to Console ---
    # print("\n--- Consolidated Output (also saved to output_general_llm_insight.json) ---")
    # for item in overall_output:
    #     print(item)
