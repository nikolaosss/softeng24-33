import requests
from commands.auth import get_token

def tollstationpasses(station, from_date, to_date, format):
    url = f"http://localhost:3001/api/tollStationPasses/{station}/{from_date}/{to_date}?format={format}"
    token = get_token()

    if not token:
        print("⚠ Δεν βρέθηκε token. Κάνε login πρώτα!")
        return

    headers = {"x-observatory-auth": token}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ Passes Data:", response.json())
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
