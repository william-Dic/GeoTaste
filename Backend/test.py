import requests
import json
from collections import Counter, defaultdict

API_KEY = "rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0"
INSIGHTS_URL = "https://hackathon.api.qloo.com/v2/insights"

def get_location_tag_insights(city, country_code, take=50):
    """
    Fetch tag (taste) insights for a given city and country_code from Qloo.
    Returns the parsed JSON response (dict) or None on error.
    """
    headers = {
        "accept": "application/json",
        "X-Api-Key": API_KEY
    }
    params = {
        "filter.type": "urn:tag",
        "signal.location.query": city,
        "signal.location.country_code": country_code,
        "take": take
    }
    try:
        response = requests.get(INSIGHTS_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching tag insights: {e}")
        return None

def find_tag_in_location(city, country_code, tag_name=None, tag_id=None, take=50):
    """
    Search for a specific tag by name or ID in the tag insights for a location.
    Returns the tag dict if found, else None.
    """
    data = get_location_tag_insights(city, country_code, take=take)
    if not data:
        print("No data returned from get_location_tag_insights.")
        return None
    tags = data.get('results', {}).get('tags', [])
    for tag in tags:
        if tag_id and tag.get('tag_id') == tag_id:
            return tag
        if tag_name and tag.get('name') == tag_name:
            return tag
    print(f"Tag not found: {tag_name or tag_id}")
    return None

def count_tag_subtypes(city, country_code, take=50):
    """
    Count the occurrences of each tag subtype in the tag insights for a location.
    Returns a Counter object mapping subtype to count.
    """
    data = get_location_tag_insights(city, country_code, take=take)
    if not data:
        print("No data returned from get_location_tag_insights.")
        return Counter()
    tags = data.get('results', {}).get('tags', [])
    subtypes = [tag.get('subtype', 'unknown') for tag in tags]
    return Counter(subtypes)

def get_location_entity_recommendations(location_query, entity_type="urn:entity:movie", take=10):
    """
    Fetch entity recommendations (e.g., movies) for a given location using the Qloo Insights API.
    Returns the parsed JSON response (dict) or None on error.
    """
    headers = {
        "accept": "application/json",
        "X-Api-Key": API_KEY
    }
    params = {
        "filter.type": entity_type,
        "signal.location.query": location_query,
        "take": take
    }
    try:
        response = requests.get(INSIGHTS_URL, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching entity recommendations: {e}")
        return None

if __name__ == "__main__":
    # Only test the new function
    location_query = "London"
    entity_type = "urn:entity:movie"
    data = get_location_entity_recommendations(location_query, entity_type)
    print(json.dumps(data, indent=2))
