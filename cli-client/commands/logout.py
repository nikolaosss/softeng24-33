import requests
import os
from commands.auth import get_token  # Εισάγουμε τη συνάρτηση για το token

TOKEN_FILE = "token.txt"

def logout():
    """ Εκτελεί logout και διαγράφει το αποθηκευμένο token """
    url = "http://localhost:3001/api/logout"
    token = get_token()

    if not token:
        print("⚠ Δεν υπάρχει συνδεδεμένος χρήστης (token not found).")
        return

    headers = {
        "x-observatory-auth": token  # ✅ Αποστολή του authentication token
    }

    try:
        response = requests.post(url, headers=headers)
        
        if response.status_code == 200:
            print("✅ Logout successful")
            os.remove(TOKEN_FILE)  # ✅ Διαγραφή του αποθηκευμένου token
        else:
            print(f"❌ Error {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
