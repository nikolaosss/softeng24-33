import requests

def passescost(stationop, tagop, from_date, to_date, opid):
    url = f"http://localhost:5000/api/passescost/{stationop}/{tagop}/{from_date}/{to_date}/{opid}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Passes Cost:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))