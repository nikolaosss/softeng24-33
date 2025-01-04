import requests

def healthcheck():
    url = "http://localhost:5000/api/admin/healthcheck"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Healthcheck OK:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
