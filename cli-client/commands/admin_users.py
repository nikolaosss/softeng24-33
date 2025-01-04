import requests

def admin_users():
    url = "http://localhost:5000/api/admin/users"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Users:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))