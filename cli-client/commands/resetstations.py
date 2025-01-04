import requests

def resetstations():
    url = "http://localhost:5000/api/admin/resetstations"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print("Stations Reset Successfully")
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
