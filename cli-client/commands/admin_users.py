import requests
from commands.auth import get_token

BASE_URL = "http://localhost:3001/api"

def admin_users():
    """Κλήση API για εμφάνιση χρηστών"""
    token = get_token()

    if not token:
        print("⚠ Δεν βρέθηκε token. Κάνε login πρώτα!")
        return

    headers = {"x-observatory-auth": token}
    response = requests.get(f"{BASE_URL}/admin/users", headers=headers)
    
    if response.status_code == 200:
        print("✅ Χρήστες:", response.json())
    else:
        print(f"❌ Σφάλμα: {response.status_code}, {response.text}")
