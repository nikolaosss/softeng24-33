import requests
from commands.auth import get_token

def admin_addpasses(source):
    url = "http://localhost:3001/api/admin/addpasses"
    token = get_token()
    
    if not token:
        print("⚠ Δεν βρέθηκε token. Κάνε login πρώτα!")
        return

    headers = {"x-observatory-auth": token}

    try:
        with open(source, 'r') as file:
            data = file.read()
        response = requests.post(url, headers=headers, data=data)
        if response.status_code == 200:
            print("✅ Passes added successfully")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    except FileNotFoundError:
        print("❌ Source file not found.")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
