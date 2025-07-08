import os
import requests

API_KEY = os.getenv('QLOO_API_KEY', 'rZ4JDgPEmJBGYuLtY233M_l0Jxm0QdLXFs6N-6XYaA0')

url = "https://hackathon.api.qloo.com/v2/insights/?filter.type=urn:entity:place&signal.interests.entities=FCE8B172-4795-43E4-B222-3B550DC05FD9&filter.location.query=40.7831° N, 73.9712° W"
headers = {
    'X-Api-Key': API_KEY
}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    print(response.json())
except requests.RequestException as e:
    print(f"Error: {e}")
