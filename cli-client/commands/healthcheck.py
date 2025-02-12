import requests
import os

TOKEN_FILE = "token.txt"  # Τοπική αποθήκευση του token

def get_token():
    """Διαβάζει το αποθηκευμένο token από το αρχείο."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return f.read().strip()
    return None

def healthcheck():
    url = "https://localhost:3001/api/admin/healthcheck"
    token = get_token()  # Παίρνουμε το token
    
    if not token:
        print("no token found, login first!")
        return

    headers = {
        "x-observatory-auth": token  # ✅ Προσθήκη authentication header
    }

    try:
        response = requests.get(url, headers=headers,verify=False)  # ✅ Στέλνουμε το request με το token
        if response.status_code == 200:
            print("Healthcheck OK:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))

