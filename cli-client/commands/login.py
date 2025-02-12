import requests
import os

BASE_URL = "http://localhost:3001/api"
TOKEN_FILE = "token.txt"  # Τοπική αποθήκευση

def login(username, password):
    url = f"{BASE_URL}/login"
    data = {"username": username, "password": password}  # Βεβαιώσου ότι το API περιμένει αυτά τα keys

    try:
        response = requests.post(url, json=data)
        print("Response Status Code:", response.status_code)  # Debug
        print("Response Body:", response.text)  # Debug

        response.raise_for_status()  # Ρίχνει σφάλμα αν το request δεν είναι 200 OK

        result = response.json()
        token = result.get("token")
        if token:
            with open(TOKEN_FILE, "w") as f:
                f.write(token)
            print("Login successful. Token stored.")
        else:
            print("Login failed: No token received.")

    except requests.exceptions.RequestException as e:
        print(f"Error during login: {e}")
