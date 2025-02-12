import requests
from commands.auth import get_token

def passescost(stationop, tagop, from_date, to_date, opid):
    url = f"http://localhost:3001/api/passescost/{stationop}/{tagop}/{from_date}/{to_date}/{opid}"
    token = get_token()

    if not token:
        print("⚠ Δεν βρέθηκε token. Κάνε login πρώτα!")
        return

    headers = {"x-observatory-auth": token}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Passes Cost:", response.json())
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
