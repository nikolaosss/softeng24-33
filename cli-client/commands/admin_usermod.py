import requests
from commands.auth import get_token

BASE_URL = "https://localhost:3001/api"

def admin_usermod(username, passw):
    """ Δημιουργεί ή τροποποιεί έναν χρήστη μέσω API """
    url = f"{BASE_URL}/admin/usermod/"
    token = get_token()
    
    if not token:
        print("no token found, login first!")
        return

    headers = {"x-observatory-auth": token}
    data = {"username": username, "passw": passw}

    response = requests.post(url, headers=headers, json=data, verify=False)

    if response.status_code == 200:
        print(f"Ο χρήστης '{username}' τροποποιήθηκε/δημιουργήθηκε με επιτυχία.")
    else:
        print(f"Σφάλμα: {response.status_code}, {response.text}")
