import requests

def admin_usermod(username, password):
    url = "http://localhost:5000/api/admin/usermod"
    payload = {"username": username, "password": password}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("User modification successful")
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))