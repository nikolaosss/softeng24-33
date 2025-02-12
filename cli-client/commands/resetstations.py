import requests
from commands.auth import get_token

def resetstations():
    url = "https://localhost:3001/api/admin/resetstations"
    token = get_token()

    if not token:
        print("no token found, login first!")
        return

    headers = {"x-observatory-auth": token}

    try:
        response = requests.post(url, headers=headers)
        if response.status_code == 200:
            print("Stations Reset Successfully")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
