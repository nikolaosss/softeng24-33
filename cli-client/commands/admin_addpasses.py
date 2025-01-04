def admin_addpasses(source):
    url = "http://localhost:5000/api/admin/addpasses"
    try:
        with open(source, 'r') as file:
            data = file.read()
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print("Passes added successfully")
        else:
            print("Error:", response.status_code, response.text)
    except FileNotFoundError:
        print("Source file not found.")
    except requests.exceptions.RequestException as e:
        print("Connection error:", str(e))
