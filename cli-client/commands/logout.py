import requests
import os
from commands.auth import get_token  # Εισάγουμε τη συνάρτηση για το token

TOKEN_FILE = "token.txt"
PATH = "localhost.pem"

def logout():
    """ Εκτελεί logout και διαγράφει το αποθηκευμένο token """
    url = "https://localhost:3001/api/logout"
    token = get_token()

    if not token:
        print("no logged in user (token not found).")
        return

    headers = {
        "x-observatory-auth": token
    }

    try:
        response = requests.post(url, headers=headers, verify=False)

        if response.status_code == 200:
            print("Logout successful")
            os.remove(TOKEN_FILE)  
        else:
            print(f"Error {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
