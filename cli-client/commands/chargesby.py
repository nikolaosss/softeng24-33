import requests 

def chargesby(opid, from_date, to_date):
    url = f"http://localhost:5000/api/chargesby/{opid}/{from_date}/{to_date}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Charges By:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))