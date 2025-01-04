import requests

def logout():
    url = "http://localhost:5000/api/logout"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print("Logout successful")
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
