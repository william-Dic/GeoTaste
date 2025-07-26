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
