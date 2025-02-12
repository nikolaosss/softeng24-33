import requests
import os

BASE_URL = "https://localhost:3001/api"

TOKEN_FILE = "token.txt"  # Τοπική αποθήκευση


def get_token():
    """Διαβάζει το αποθηκευμένο token από το αρχείο."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return f.read().strip()
    return None



def chargesby(opid, from_date, to_date):
    token = get_token()
    if not token:
        print("Error: You must login first.")
        return

    url = f"{BASE_URL}/chargesby/{opid}/{from_date}/{to_date}"
    headers = {"x-observatory-auth": token}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print(response.json())  # Εμφάνιση αποτελεσμάτων

    except requests.exceptions.RequestException as e:
        print(f"Error fetching charges: {e}")