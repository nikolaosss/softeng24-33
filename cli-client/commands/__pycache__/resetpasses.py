import requests

def resetpasses():
    url = "https://localhost:9115/api/admin/resetpasses"
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print("Passes have been reset successfully.")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
