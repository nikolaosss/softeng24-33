import requests

def tollstationpasses(station, from_date, to_date, format):
    url = f"http://localhost:5000/api/tollStationPasses/{station}/{from_date}/{to_date}?format={format}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("Passes Data:", response.json())
        else:
            print("Error:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
