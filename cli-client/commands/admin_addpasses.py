import requests
from commands.auth import get_token

def admin_addpasses(source):
    url = "https://localhost:3001/api/admin/addpasses"
    token = get_token()

    if not token:
        print("no token found, login first!")
        return

    headers = {
        "x-observatory-auth": token  # Authorization Header
    }

    try:
        with open(source, 'rb') as file:  # ✅ Άνοιγμα αρχείου σε binary mode
            files = {'csvFile': file}  # ✅ Multipart form-data (το key πρέπει να ταιριάζει με το backend)

            response = requests.post(url, headers=headers, files=files)  # ✅ Χρήση files αντί data
            
            if response.status_code == 200:
                print("Passes added successfully")
            else:
                print(f"Error {response.status_code}: {response.text}")

    except FileNotFoundError:
        print("Source file not found.")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
