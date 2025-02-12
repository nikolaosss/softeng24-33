import requests
from commands.auth import get_token

def passanalysis(stationop, tagop, from_date, to_date):
    url = f"https://localhost:3001/api/passanalysis/{stationop}/{tagop}/{from_date}/{to_date}"
    token = get_token()

    if not token:
        print("no token found, login first!")
        return

    headers = {"x-observatory-auth": token}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("Pass Analysis:", response.json())
        else:
            print(f"Error {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
